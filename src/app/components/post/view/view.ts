import View from '!view!./view.html?style=./view.styl';
import { AppAd } from 'game-jolt-frontend-lib/components/ad/ad';
import { AppAdPlacement } from 'game-jolt-frontend-lib/components/ad/placement/placement';
import {
	canUserManagePost,
	FiresidePost,
} from 'game-jolt-frontend-lib/components/fireside/post/post-model';
import { AppImgResponsive } from 'game-jolt-frontend-lib/components/img/responsive/responsive';
import { AppResponsiveDimensions } from 'game-jolt-frontend-lib/components/responsive-dimensions/responsive-dimensions';
import { Screen } from 'game-jolt-frontend-lib/components/screen/screen-service';
import { AppScrollWhen } from 'game-jolt-frontend-lib/components/scroll/scroll-when.directive.vue';
import { AppSketchfabEmbed } from 'game-jolt-frontend-lib/components/sketchfab/embed/embed';
import { AppTimeAgo } from 'game-jolt-frontend-lib/components/time/ago/ago';
import { AppVideoEmbed } from 'game-jolt-frontend-lib/components/video/embed/embed';
import { AppVideo } from 'game-jolt-frontend-lib/components/video/video';
import { AppWidgetCompiler } from 'game-jolt-frontend-lib/components/widget-compiler/widget-compiler';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Store } from '../../../store';
import { AppEventItemControls } from '../../event-item/controls/controls';
import { AppEventItemManagePost } from '../../event-item/manage/post/post';
import { AppEventItemMediaTags } from '../../event-item/media-tags/media-tags';
import { AppPollVoting } from '../../poll/voting/voting';
import { AppPostViewPlaceholder } from './placeholder/placeholder';

@View
@Component({
	components: {
		AppPostViewPlaceholder,
		AppTimeAgo,
		AppWidgetCompiler,
		AppResponsiveDimensions,
		AppImgResponsive,
		AppVideo,
		AppVideoEmbed,
		AppSketchfabEmbed,
		AppEventItemManagePost,
		AppEventItemControls,
		AppEventItemMediaTags,
		AppPollVoting,
		AppAd,
		AppAdPlacement,
	},
	directives: {
		AppScrollWhen,
	},
})
export class AppPostView extends Vue {
	@Prop(FiresidePost)
	post!: FiresidePost;

	@Prop(Boolean)
	showGameInfo?: boolean;

	@State
	app!: Store['app'];

	readonly Screen = Screen;

	get shouldShowManage() {
		return this.post && canUserManagePost(this.post, this.app.user);
	}
}
