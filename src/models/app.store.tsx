import { redux, ReduxStore, reducers, effects, service } from '../libs';
import { AppService } from './app.service';

@redux
export class AppStore extends ReduxStore {

    public logined: boolean;
    public loading: boolean;
    public fetching: boolean;

    @service(AppService)
    public service!: AppService;

    constructor() {
        super();
        this.logined = false;
        this.loading = true;
        this.fetching = false;
    }

    @reducers
    public async updateState(state, { payload }) {
        return { ...state, ...payload };
    }

    @effects
    public *login({ payload }, { call, put }) {
        // params formmat, post or get to server
        yield put(this.createAction((acts => acts.updateState))({ fetching: true }))
        const logined = yield call(this.service.login, payload)
        yield put(this.createAction((acts => acts.updateState))({ logined, fetching: false }))
    }

    @effects
    public *logout(action, { call, put }) {
        yield put(this.createAction((acts => acts.updateState))({ logined: false }))
    }
}
