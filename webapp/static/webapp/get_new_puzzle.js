export const get_new_puzzle = async () => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const res = await fetch("http://127.0.0.1:8000/new_pazzle/4", requestOptions)
    return res.text()
}