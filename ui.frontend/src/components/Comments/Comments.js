
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faComment, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

require('./Comments.css');

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentText: '',
      maxCharacters: 100,
      likes: [],
    };
  }

  async componentDidMount() {
    try {
      const comments = await this.getComments();
      const likes = Array(comments.length).fill(0);
      this.setState({ comments, likes });
    } catch (error) {
      console.error(error);
    }
  }

  getCsrfToken = async () => {
    const response = await fetch('/libs/granite/csrf/token.json');
    const json = await response.json();
    return json.token;
  };

  getComments = async () => {
    const csrfToken = await this.getCsrfToken();
    const response = await fetch('/bin/showcase/comments', {
      method: 'GET',
      headers: {
        'CSRF-Token': csrfToken,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const comments = await response.json();
    return comments;
  };

  handleLikeClick = (index) => {
    this.setState((prevState) => {
      const updatedLikes = [...prevState.likes];
      updatedLikes[index]++;
      return { likes: updatedLikes };
    });
  };

  handleCommentChange = (value) => {
    this.setState({ commentText: value });
  };

  render() {
    const { commentText, maxCharacters, likes } = this.state;
    const charactersRemaining = maxCharacters - commentText.length;

    return (
      <div className='comments-container'>
        <h3 className="">{this.props.commentTitle}</h3>

        <div className="comment-content">
          <div className="comment-header-send">
            <FontAwesomeIcon className="user-icon" icon={faUser} />
            <div className="comment-character-count">
              <ReactQuill
                value={commentText}
                onChange={this.handleCommentChange}
                placeholder="Adicionar comentário..."
              />
              <span className='comment-text-character'>{charactersRemaining}/{maxCharacters} caracteres restantes</span>

            </div>
          </div>
          <button className='comment-btn-send' onClick={() => this.props.onSubmitComment(commentText)}><FontAwesomeIcon icon={faArrowDown} /></button>
        </div>

        <div>
          {this.props.commentTitle && (
            <>
              {this.state.comments.map((comment, index) => (
                <div className="comment-content" key={index}>
                  <div className="commet-card-border">
                    <div className="comment-header">
                      <FontAwesomeIcon className="user-icon" icon={faUser} />
                      <h3 className="comment-username">user</h3>
                    </div>
                    <p className="comment-body">{comment.content}</p>
                  </div>

                  <div className="comment-actions">
                    <button className="comment-bnt-transparent btn-reply"><FontAwesomeIcon icon={faComment} /></button>
                    <button className="comment-bnt-transparent btn-like" onClick={() => this.handleLikeClick(index)}>
                      {likes[index]} <FontAwesomeIcon icon={faHeart} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Comments;