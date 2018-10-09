import View from '!view!./members.html';
import { Api } from 'game-jolt-frontend-lib/components/api/api.service';
import { Community } from 'game-jolt-frontend-lib/components/community/community.model';
import {
	BaseRouteComponent,
	RouteResolve,
} from 'game-jolt-frontend-lib/components/route/route-component';
import { User } from 'game-jolt-frontend-lib/components/user/user.model';
import { Component, Prop } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { AppFollowerList } from '../../../../components/follower/list/list';

function getFetchUrl(route: Route) {
	return `/web/communities/members/${route.params.path}`;
}

@View
@Component({
	name: 'RouteCommunitiesViewMembers',
	components: {
		AppFollowerList,
	},
})
export default class RouteCommunitiesViewMembers extends BaseRouteComponent {
	@Prop(Community)
	community!: Community;

	users: User[] = [];

	get routeTitle() {
		return this.community ? `Members of the ${this.community.name} Community` : null;
	}

	get loadUrl() {
		return getFetchUrl(this.$route);
	}

	@RouteResolve({
		cache: true,
		lazy: true,
		deps: {},
	})
	routeResolve(this: undefined, route: Route) {
		return Api.sendRequest(getFetchUrl(route));
	}

	routed($payload: any) {
		this.users = User.populate($payload.users);
	}
}
