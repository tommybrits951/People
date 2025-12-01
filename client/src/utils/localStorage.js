function setAccessToken(token) {
    localStorage.setItem('accessToken', token)
}

function getAccessToken() {
    return localStorage.getItem('accessToken')
}

function removeAccessToken() {
    localStorage.removeItem('accessToken')
}

export { setAccessToken, getAccessToken, removeAccessToken }