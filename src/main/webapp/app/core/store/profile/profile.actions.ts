import { SliceAction } from '../slice/slice.actions';
import { Profile } from './profile.model';
import { slices } from '../util';

export const actions = {
    FOLLOW: 'FOLLOW',
    FOLLOW_SUCCESS: 'FOLLOW_SUCCESS',
    FOLLOW_FAIL: 'FOLLOW_FAIL',
    UNFOLLOW: 'UNFOLLOW',
    UNFOLLOW_SUCCESS: 'UNFOLLOW_SUCCESS',
    UNFOLLOW_FAIL: 'UNFOLLOW_FAIL'
}

class ProfileAction extends SliceAction {
    constructor(obj = {}) {
        super(slices.AUTHOR, obj);
    }
}

export class SpecialProfileRouteAction extends ProfileAction {
    constructor(username: string) {
        super({ route: '/profiles/' + username + '/follow' });
    }
}

export class Follow extends SpecialProfileRouteAction {
    protected actionName: string = actions.FOLLOW;
}

export class FollowSuccess extends ProfileAction {
    protected actionName: string = actions.FOLLOW_SUCCESS;
}

export class FollowFail extends ProfileAction {
    protected actionName: string = actions.FOLLOW_FAIL;
}

export class Unfollow extends SpecialProfileRouteAction {
    protected actionName: string = actions.UNFOLLOW;
}

export class UnfollowSuccess extends ProfileAction {
    protected actionName: string = actions.UNFOLLOW_SUCCESS;
}

export class UnfollowFail extends ProfileAction {
    protected actionName: string = actions.UNFOLLOW_FAIL;
}
