import VueRouter from 'vue-router';
import RouteDiscover from './discover';
import { routeDiscoverHome } from './home/home.route';
import { routeDiscoverGames } from './games/games.route';
import { routeDiscoverDevlogs } from './devlogs/devlogs.route';

export const routeDiscover: VueRouter.RouteConfig = {
	path: '/',
	component: RouteDiscover,
	children: [
		routeDiscoverHome,
		routeDiscoverGames,
		routeDiscoverDevlogs,
	]
};