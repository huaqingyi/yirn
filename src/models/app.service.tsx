import { Service, ReduxService } from '../libs';

@Service
export class AppService extends ReduxService {
    // api request data
    public async login() {
        // return this.http.get('xxxx');
        return Promise.resolve(true);
    }
}
