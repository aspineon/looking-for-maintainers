import React from "react";
import { connect } from "react-redux";
import { getRepos } from "../../actions/index";
import Header from "../partials/Header";
import RepoContainer from "../partials/RepoContainer";
import './style.css';

type ExploreProps = {
  user: any,
  getRepos: any
  repos: any
}

class Explore extends React.Component<ExploreProps> {
  componentDidMount() {
    this.props.getRepos();
  }

  render() {
    console.log(this.props);
    const { user, repos } = this.props;
    return (
      <div>
        <div className="page-wrap">

        </div>
        <div className="container mb-5 pb-4">
          <div className="body-row">
            <div className="repositories-grid">
              <div className="grid-container grid-row">
                {repos.map((repo: any) => {
                  console.log(repo);
                  return <RepoContainer repo={repo} key={repo.id} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { repos: state.repos };
};

export default connect(
  mapStateToProps,
  { getRepos }
)(Explore);
