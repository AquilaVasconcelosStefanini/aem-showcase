import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart, faUser, faComment} from '@fortawesome/free-solid-svg-icons';
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
      user: null,
      charactersRemaining: 0,
    };
  }

  async componentDidMount() { // realizar inicializações que dependem do DOM - milena
    try {
      await this.getComments();
      await this.getUserInfo();
    } catch (error) {
      console.error(error);
    }
  }

  getCsrfToken = async () => { // se precisar de token ainda , caso não precisa remove 'CSRF-Token': csrfToken, - milena
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
    this.setState({ comments });
  };

  handleCommentChange = (commentText) => { //evoluir:  esse contador 0/100 - milena
    const charactersRemaining = Math.max(0, this.state.maxCharacters - commentText.length);
    this.setState({ commentText, charactersRemaining });
  };

  handleCommentSubmit = async () => { //evoluir : se comentario estiver vazio, mostrar um alerta ou habilitar botão
    const { commentText , user } = this.state;
    const csrfToken = await this.getCsrfToken();
    
    const response = await fetch('/bin/showcase/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        content: commentText,
        created: new Date().toISOString(),
        createdBy: user.name,
        fullname: user.name, 
        upvoteCount: 0,
        userHasUpvoted: false,
        likes: [] 
      }),
    });
  
    if (response.ok) {
      await this.getComments();
      this.setState({ commentText: '' });
    } else {
      console.error('Erro, não obteve sucesso  para comentar');
    }
  };
  
  async getUserInfo() {
    try {
      const response = await fetch('/libs/granite/security/currentuser.json');
      if (!response.ok) {
        throw new Error('Erro, não conseguiu acessar informações do usuário');
      }
      const userData = await response.json();
      this.setState({ user: userData }); 
    } catch (error) {
      console.error('Erro, não conseguiu acessar informações do usuário:', error);
    }
  }

  render() {
    const { commentText, maxCharacters, user , charactersRemaining} = this.state;

    return (
      <div className='comments-container'>
        <h3 className="">{this.props.commentTitle}</h3>

        <div className="comment-content">
          <div className="comment-header">
            {/* se não tiver user cadastrado no aem , retorna You */}
            {user ? (
              <>
                <FontAwesomeIcon className="comment-user-icon" icon={faUser} />
                <h4 className="comment-username">{user.name}</h4>
              </>
            ) : (
              <>
                <FontAwesomeIcon className="comment-user-icon" icon={faUser} />
                <h4 className="comment-username">You</h4>
              </>
            )}
          </div>

          <div className="comment-header-send">
            <div className="comment-character-count">
              <ReactQuill
                value={commentText}
                onChange={(value) => this.handleCommentChange(value)}
                placeholder="Comentário..."
              />
              <span className='comment-text-character'>{charactersRemaining}/{maxCharacters}</span>
            </div>
          </div>
          <button className='comment-btn-send' onClick={() => this.handleCommentSubmit(commentText)}>
            Enviar Comentário
          </button>
        </div>

        <div>
          {this.props.commentTitle && (
            <>
              {this.state.comments.map((comment, index) => (
                <div className="comment-content" key={index} data={comment.created}>
                  <div className="commet-card-border">
                    <div className="comment-header">
                      <FontAwesomeIcon className="comment-user-icon" icon={faUser} />
                      <h4 className="comment-username">{comment.fullname}</h4>
                    </div>
                    <div className="comment-body" dangerouslySetInnerHTML={{ __html: comment.content }} />
                  </div>

                  <div className="comment-actions">
                    <button className="comment-bnt-transparent">
                      <FontAwesomeIcon icon={faComment} />
                    </button>
                    <button className="comment-bnt-transparent">
                      {comment.upvoteCount} <FontAwesomeIcon icon={faHeart} />
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
