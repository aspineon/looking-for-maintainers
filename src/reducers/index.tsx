import * as actionTypes from '../constants/action-types';
import { RepoRef, OwnerRef } from '../interface';

const initialState = {
  userPublishedRepos: [],
  successMessage: {},
  selectedLanguage: '',
  loading: false,
  error: false,
};

type processGithubSearchResponseType = (repo: RepoRef) => any;

const processGithubSearchResponse: processGithubSearchResponseType = (repo) => {
  const {
    name,
    stargazers_count,
    watchers_count,
    open_issues_count,
    created_at,
    forks_count,
    description,
    html_url,
    languages,
    owner,
    id,
  } = repo;

  const { html_url: userProfileUrl, avatar_url, login }: OwnerRef = owner;

  return {
    name,
    github_id: id,
    stargazers_count,
    watchers_count,
    open_issues_count,
    forks_count,
    description,
    html_url,
    languages,
    created_at,
    owner: {
      userProfileUrl,
      avatar_url,
      username: login,
    },
  };
};

function rootReducer(
  state = initialState,
  { type, payload }: { type: any; payload: any }
) {
  switch (type) {
    case actionTypes.SELECTED_LANGUAGE:
      return {
        ...state,
        selectedLanguage: payload,
      };
    case actionTypes.USER_REPOS_FETCHED_INIT:
      return {
        ...state,
        loading: true,
        errro: false,
      };
    case actionTypes.USER_REPOS_FETCHED_SUCCESS:
      return {
        ...state,
        userPublishedRepos: payload.map((repo: RepoRef) => ({
          ...repo,
          id: repo._id,
          isChecked: true,
        })),
        loading: false,
        error: false,
        successMessage: {},
      };
    case actionTypes.USER_GITHUB_REPOS_REMOVED:
      return {
        ...state,
        successMessage: { ...payload },
      };
    default:
      return { ...state };
  }
}
export default rootReducer;
