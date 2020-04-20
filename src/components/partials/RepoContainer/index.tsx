import React, { memo } from "react";
import { RepoRef } from "../../../interface";
import "./RepoContainer.css";

const RepoContainer: React.FunctionComponent<{ repo: RepoRef }> = (props) => {
  return (
    <div className="grid-item grid-item-container">
      <div className="grid-item-body">
        <div className="author-header clearfix">
          <a href={props.repo.owner.userProfileUrl} target="_blank">
            <div className="author-img">
              <img
                src={props.repo.owner.avatar_url}
                alt={props.repo.owner.userProfileUrl}
              />
            </div>
            <div className="author-details">
              <h5>{props.repo.owner.username}</h5>
              <p className="small text-muted">View Profile</p>
            </div>
          </a>
        </div>
        <div className="repo-header">
          <h5>
            <a href={props.repo.html_url} target="_blank">
              <span className="repo-name">{props.repo.name}</span>
            </a>
          </h5>
          <p className="repo-meta text-muted small">
            Built by ·{" "}
            <a target="_blank" href={props.repo.owner.userProfileUrl}>
              {props.repo.owner.username}
            </a>{" "}
            · {props.repo.formated_date}
          </p>
        </div>
        <div className="repo-body">
          <p>{props.repo.description || "No description given."}</p>
        </div>
        <div className="repo-footer">
          <span className="d-inline-block mr-3 footer-language">
            <span className="repo-language-color ml-0" />
            <span>{props.repo.languages[0] || "N/A"}</span>
          </span>
          <a
            className="muted-link d-inline-block mr-3"
            href={props.repo.html_url}
            target="_blank"
          >
            <svg
              viewBox="0 0 14 16"
              version="1.1"
              width="14"
              height="16"
              role="img"
            >
              <path
                fill-rule="evenodd"
                d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"
              />
            </svg>
            {props.repo.stargazers_count}
          </a>
          <a
            className="muted-link d-inline-block mr-3"
            href={props.repo.html_url + "/network/members"}
            target="_blank"
          >
            <svg
              viewBox="0 0 10 16"
              version="1.1"
              width="10"
              height="16"
              role="img"
            >
              <path
                fill-rule="evenodd"
                d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"
              />
            </svg>
            {props.repo.forks_count}
          </a>
          <a
            className="muted-link d-inline-block mr-3"
            href={props.repo.html_url + "/watchers"}
            target="_blank"
          >
            <svg
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"
              />
            </svg>
            {props.repo.watchers_count}
          </a>
        </div>
      </div>
    </div>
  );
};

export default memo(RepoContainer);
