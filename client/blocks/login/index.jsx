/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FormsButton from 'components/forms/form-button';
import Card from 'components/card';
import FormTextInput from 'components/forms/form-text-input';
import { loginUser } from 'state/login/actions';
import Notice from 'components/notice';
import { externalRedirect } from 'lib/route/path';

import {
	isRequestingLogin,
	isLoginSuccessful,
	getError
} from 'state/login/selectors';

export class Login extends Component {
	static propTypes = {
		isRequestingLogin: PropTypes.bool.isRequired,
		loginUser: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
		isLoginSuccessful: PropTypes.bool,
		loginError: PropTypes.string,
		redirectLocation: PropTypes.string,
		title: PropTypes.string,
	};

	static defaultProps = {
		title: '',
	};

	constructor() {
		super();
		this.state = {
			usernameOrEmail: '',
			password: '',
		};
		this.onChangeField = this.onChangeField.bind( this );
		this.onSubmitForm = this.onSubmitForm.bind( this );
	}

	componentDidUpdate() {
		if ( this.props.isLoginSuccessful ) {
			externalRedirect( this.props.redirectLocation || '/' );
		}
	}

	onChangeField( event ) {
		this.setState( {
			[ event.target.name ]: event.target.value
		} );
	}

	onSubmitForm( event ) {
		event.preventDefault();
		this.props.loginUser( this.state.usernameOrEmail, this.state.password );
	}

	renderNotices() {
		if ( this.props.loginError ) {
			return (
				<Notice status="is-error" text={ this.props.loginError } />
			);
		}
	}

	render() {
		const isDisabled = {};
		if ( this.props.isRequestingLogin ) {
			isDisabled.disabled = true;
		}

		return (
			<div className="login">

				{ this.renderNotices() }

				<form onSubmit={ this.onSubmitForm }>
					<Card className="login__form-userdata">
						<div className="login__form-header">
							<div className="login__form-header-title">
								{ this.props.title }
							</div>
						</div>
						<div className="login__form-userdata">
							<label className="login__form-userdata-username">
								{ this.props.translate( 'Username or Email' ) }
								<FormTextInput
									className="login__form-userdata-username-input"
									onChange={ this.onChangeField }
									name="usernameOrEmail"
									value={ this.state.usernameOrEmail }
									{ ...isDisabled } />
							</label>
							<label className="login__form-userdata-username">
								{ this.props.translate( 'Password' ) }
								<input
									className="login__form-userdata-username-password"
									onChange={ this.onChangeField }
									type="password"
									name="password"
									value={ this.state.password }
									{ ...isDisabled } />
							</label>
						</div>
						<div className="login__form-action">
							<FormsButton primary { ...isDisabled }>
								{ this.props.translate( 'Sign in' ) }
							</FormsButton>
						</div>
					</Card>
				</form>
			</div>
		);
	}
}

export default connect( state => {
	return {
		isRequestingLogin: isRequestingLogin( state ),
		isLoginSuccessful: isLoginSuccessful( state ),
		loginError: getError( state )
	};
}, {
	loginUser
} )( localize( Login ) );
