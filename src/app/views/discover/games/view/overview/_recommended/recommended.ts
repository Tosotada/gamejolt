import View from '!view!./recommended.html';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Screen } from '../../../../../../../lib/gj-lib-client/components/screen/screen-service';
import { AppGameGrid } from '../../../../../../components/game/grid/grid';
import { AppGameGridPlaceholder } from '../../../../../../components/game/grid/placeholder/placeholder';
import { AppGameList } from '../../../../../../components/game/list/list';
import { AppGameListPlaceholder } from '../../../../../../components/game/list/placeholder/placeholder';
import { RouteStore, RouteStoreModule } from '../../view.store';

@View
@Component({
	components: {
		AppGameGridPlaceholder,
		AppGameGrid,
		AppGameListPlaceholder,
		AppGameList,
	},
})
export class AppDiscoverGamesViewOverviewRecommended extends Vue {
	@RouteStoreModule.State
	recommendedGames!: RouteStore['recommendedGames'];

	readonly Screen = Screen;
}
