import { Component, Prop } from 'vue-property-decorator';
import { CreateElement } from 'vue/types/vue';
import { Api } from '../../../../lib/gj-lib-client/components/api/api.service';
import { CommentModal } from '../../../../lib/gj-lib-client/components/comment/modal/modal.service';
import { FiresidePost } from '../../../../lib/gj-lib-client/components/fireside/post/post-model';
import { Meta } from '../../../../lib/gj-lib-client/components/meta/meta-service';
import { Registry } from '../../../../lib/gj-lib-client/components/registry/registry.service';
import {
	BaseRouteComponent,
	RouteResolver,
} from '../../../../lib/gj-lib-client/components/route/route-component';
import { Translate } from '../../../../lib/gj-lib-client/components/translate/translate.service';
import { enforceLocation } from '../../../../lib/gj-lib-client/utils/router';
import { IntentService } from '../../../components/intent/intent.service';
import { AppPostView } from '../../../components/post/view/view';
import { RouteStore, RouteStoreModule } from '../profile.store';

@Component({
	name: 'RouteProfilePostView',
	components: {
		AppPostView,
	},
})
@RouteResolver({
	lazy: true,
	cache: true,
	deps: { params: ['slug'], query: ['intent'] },
	async resolver({ route }) {
		const intentRedirect = IntentService.checkRoute(route, {
			intent: 'like-post',
			message: Translate.$gettext(`You like this post! That's cool.`),
		});
		if (intentRedirect) {
			return intentRedirect;
		}

		const postHash = FiresidePost.pullHashFromUrl(route.params.slug);
		const payload = await Api.sendRequest('/web/posts/view/' + postHash);

		if (payload && payload.post) {
			const redirect = enforceLocation(route, { slug: payload.post.slug });
			if (redirect) {
				return redirect;
			}
		}

		return payload;
	},
})
export default class RouteProfilePostView extends BaseRouteComponent {
	@Prop()
	slug!: string;

	@RouteStoreModule.State
	user!: RouteStore['user'];

	post: FiresidePost | null = null;

	get routeTitle() {
		return this.post ? this.post.lead_snippet : null;
	}

	routeCreated() {
		CommentModal.checkPermalink(this.$router);

		const hash = FiresidePost.pullHashFromUrl(this.slug);
		this.post = Registry.find<FiresidePost>('FiresidePost', i => i.hash === hash);
	}

	routeResolved($payload: any) {
		const post = new FiresidePost($payload.post);
		if (this.post) {
			this.post.assign(post);
		} else {
			this.post = post;
		}

		this.post.$viewed();
		this.post.$expanded();

		Meta.description = $payload.metaDescription;
		Meta.fb = $payload.fb;
		Meta.twitter = $payload.twitter;
	}

	render(h: CreateElement) {
		return h(AppPostView, {
			props: {
				post: this.post,
			},
		});
	}
}
