/**
 * @typedef {Object} LoginViewProps
 * @property {boolean} showPassword
 * @property {() => void} onToggleShowPassword
 * @property {{ email:string, password:string }} loginForm
 * @property {(updater: any) => void} setLoginForm
 * @property {{ name:string, email:string, password:string, confirmPassword:string }} registerForm
 * @property {(updater: any) => void} setRegisterForm
 * @property {(e:any) => void} onLoginSubmit
 * @property {(e:any) => void} onRegisterSubmit
 * @property {Array<{icon:"Film"|"Star"|"Users"|"Bookmark", title:string, description:string}>} features
 * @property {(email:string)=>void} onLogin
 */

export {};