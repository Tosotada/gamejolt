import View from '!view!./overview.html?style=./overview.styl';
import { Api } from 'game-jolt-frontend-lib/components/api/api.service';
import { AppExpand } from 'game-jolt-frontend-lib/components/expand/expand';
import { AppFadeCollapse } from 'game-jolt-frontend-lib/components/fade-collapse/fade-collapse';
import { Game } from 'game-jolt-frontend-lib/components/game/game.model';
import 'game-jolt-frontend-lib/components/lazy/placeholder/placeholder.styl';
import { Meta } from 'game-jolt-frontend-lib/components/meta/meta-service';
import {
	BaseRouteComponent,
	RouteResolver,
} from 'game-jolt-frontend-lib/components/route/route-component';
import { Screen } from 'game-jolt-frontend-lib/components/screen/screen-service';
import { AppTooltip } from 'game-jolt-frontend-lib/components/tooltip/tooltip';
import { UserFriendship } from 'game-jolt-frontend-lib/components/user/friendship/friendship.model';
import { User } from 'game-jolt-frontend-lib/components/user/user.model';
import { YoutubeChannel } from 'game-jolt-frontend-lib/components/youtube/channel/channel-model';
import { number } from 'game-jolt-frontend-lib/vue/filters/number';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import {
	LinkedAccount,
	Provider,
} from '../../../../lib/gj-lib-client/components/linked-account/linked-account.model';
import { Store } from '../../../store/index';
import { RouteStore, RouteStoreModule } from '../profile.store';
import { AppGameList } from './../../../components/game/list/list';
import { AppGameListPlaceholder } from './../../../components/game/list/placeholder/placeholder';

@View
@Component({
	name: 'RouteProfileOverview',
	components: {
		AppExpand,
		AppFadeCollapse,
		AppGameList,
		AppGameListPlaceholder,
	},
	directives: {
		AppTooltip,
	},
	filters: {
		number,
	},
})
@RouteResolver({
	cache: true,
	lazy: true,
	deps: {},
	resolver: ({ route }) => Api.sendRequest('/web/profile/overview/@' + route.params.username),
})
export default class RouteProfileOverview extends BaseRouteComponent {
	@State
	app!: Store['app'];

	@RouteStoreModule.State
	user!: RouteStore['user'];

	@RouteStoreModule.State
	gamesCount!: RouteStore['gamesCount'];

	@RouteStoreModule.State
	videosCount!: RouteStore['videosCount'];

	@RouteStoreModule.State
	userFriendship!: RouteStore['userFriendship'];

	@RouteStoreModule.Action
	sendFriendRequest!: RouteStore['sendFriendRequest'];

	@RouteStoreModule.Action
	acceptFriendRequest!: RouteStore['acceptFriendRequest'];

	@RouteStoreModule.Action
	cancelFriendRequest!: RouteStore['cancelFriendRequest'];

	@RouteStoreModule.Action
	rejectFriendRequest!: RouteStore['rejectFriendRequest'];

	@RouteStoreModule.Action
	removeFriend!: RouteStore['removeFriend'];

	showFullDescription = false;
	canToggleDescription = false;
	games: Game[] = [];
	developerGames: Game[] = [];
	youtubeChannels: YoutubeChannel[] = [];
	linkedAccounts: LinkedAccount[] = [];

	static readonly PROVIDERS: Provider[] = [
		LinkedAccount.PROVIDER_TWITTER,
		LinkedAccount.PROVIDER_GOOGLE,
		LinkedAccount.PROVIDER_TWITCH,
	];

	readonly User = User;
	readonly UserFriendship = UserFriendship;
	readonly Screen = Screen;

	get routeTitle() {
		if (this.user) {
			return `${this.user.display_name} (@${this.user.username})`;
		}
		return null;
	}

	get leftColClass() {
		return '-left-col col-xs-12 col-sm-10 col-sm-offset-1 col-md-offset-0 col-md-8 col-lg-7';
	}

	get rightColClass() {
		return '-right-col col-xs-12 col-sm-10 col-sm-offset-1 col-md-offset-0 col-md-4';
	}

	get isBioLoaded() {
		return this.user && typeof this.user.description_compiled !== 'undefined';
	}

	get canAddAsFriend() {
		return (
			this.app.user &&
			this.user &&
			this.user.id !== this.app.user.id &&
			!this.userFriendship &&
			!this.user.is_verified
		);
	}

	get hasQuickButtonsSection() {
		return (
			this.canAddAsFriend ||
			(Screen.isMobile && (this.gamesCount > 0 || this.videosCount > 0))
		);
	}

	get hasLinksSection() {
		return (
			this.user &&
			(this.youtubeChannels.length > 0 ||
				(this.linkedAccounts && this.linkedAccounts.length > 0) ||
				this.user.web_site)
		);
	}

	get hasGamesSection() {
		return !Screen.isMobile && this.gamesCount > 0;
	}

	get twitterAccount() {
		return this.getLinkedAccount(LinkedAccount.PROVIDER_TWITTER);
	}

	get googleAccount() {
		return this.getLinkedAccount(LinkedAccount.PROVIDER_GOOGLE);
	}

	get twitchAccount() {
		return this.getLinkedAccount(LinkedAccount.PROVIDER_TWITCH);
	}

	get tumblrAccount() {
		const account = this.getLinkedAccount(LinkedAccount.PROVIDER_TUMBLR);
		if (account && account.tumblrSelectedBlog) {
			return account;
		}
		return null;
	}

	getLinkedAccount(provider: Provider) {
		if (
			this.user &&
			this.linkedAccounts &&
			this.linkedAccounts.some(i => i.provider === provider)
		) {
			const account = this.linkedAccounts.find(i => i.provider === provider);
			if (account) {
				return account;
			}
		}
		return null;
	}

	routeResolved($payload: any) {
		Meta.description = $payload.metaDescription;
		Meta.fb = $payload.fb || {};
		Meta.fb.title = this.routeTitle;
		Meta.twitter = $payload.twitter || {};
		Meta.twitter.title = this.routeTitle;

		this.showFullDescription = false;
		this.youtubeChannels = YoutubeChannel.populate($payload.youtubeChannels);
		this.games = Game.populate($payload.developerGamesTeaser);
		this.linkedAccounts = LinkedAccount.populate($payload.linkedAccounts);
	}
}
