import { Component } from "react";
import './Login.css'

class Login extends Component {
    constructor() {
        super();
        this.state = {
            showLoginForm: true
        }
    }

    toggle = () => {
        this.setState(prevState => ({
            showLoginForm: !prevState.showLoginForm
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // Perform login validation or API call here
        // If the login is successful, call the onLogin function passed down as a prop
        this.props.onLogin();
    };

    render() {
        const showLogin = this.state.showLoginForm
        return (
            <div className="login-page">
                <div className="form">
                    {showLogin ? (
                        <form className="login-form" onSubmit={this.handleSubmit}>
                            <input type="text" placeholder="username" />
                            <input type="password" placeholder="password" />
                            <button type="submit">login</button>
                            <p className="message">Not registered? <a href="#" onClick={this.toggle}>Create an account</a></p>
                        </form>
                    ) : (
                        <form className="register-form">
                            <input type="text" placeholder="name" />
                            <input type="password" placeholder="password" />
                            <input type="text" placeholder="email address" />
                            <button>create</button>
                            <p className="message">Already registered? <a href="#" onClick={this.toggle}>Sign In</a></p>
                        </form>
                    )}
                </div>
            </div>
        )
    }
}

export default Login;