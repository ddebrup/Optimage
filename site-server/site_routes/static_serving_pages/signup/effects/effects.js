const createOtpEndpoint = "/api/otp"
const verifyOtpEndpoint = "/api/otp/verify-otp"
const createUserEndpoint = "/api/sign-up"
let stateObj = {
    otpSendingStage: false,
    otpVerifiedStage: false,
    registrationStage: false
}
let token = null

const instanceAxios = axios.create({
    timeout: 8000,
    headers: { 'Authorization': 'Bearer ' + token }
});

const reqListener = (method, url, data) => {
    return new Promise((resolve, reject) => {
        instanceAxios({
            method: method,
            url: url,
            data: data
        }).then((res) => {
            console.log(res.data);
            resolve({
                success: res.data
            })
        }).catch((err) => {
            console.log(err.response.data);
            resolve({
                err: err.response.data
            })
        })
    })
}
document.getElementById('registration-form').addEventListener('submit', async(e) => {
    e.preventDefault()
    if (!stateObj.otpSendingStage) {
        console.log('stage1');
        const form = e.target
        let data = {
            email: form.email.value
        }
        const { success, err } = await reqListener('post', createOtpEndpoint, data)
        if (success && success.success === true) {
            console.log('otp sent');
            document.getElementById('res-mssg').innerText = "Otp sent successfully to " + form.email.value + " please enter to validate. Otp is valid for 10 mins"
            form.otp.removeAttribute('disabled')
            stateObj.otpSendingStage = true
            document.getElementById('submit-btn').innerText = "Verify OTP"
        } else if (err) {
            document.getElementById('res-mssg').innerText = "Failed please try again or account already exist"
        }
    } else if (!stateObj.otpVerifiedStage) {
        console.log('stage2');
        const form = e.target
        let data = {
            email: form.email.value,
            otp: form.otp.value
        }
        const { success, err } = await reqListener('post', verifyOtpEndpoint, data)
        if (success && success.success === true) {
            console.log('otp sent');
            document.getElementById('res-mssg').innerText = success.message
            form.password.removeAttribute('disabled')
            form.name.removeAttribute('disabled')
            form.phonenum.removeAttribute('disabled')
            stateObj.otpVerifiedStage = true
            document.getElementById('submit-btn').innerText = "Register"

        } else if (err) {
            document.getElementById('res-mssg').innerText = "Entered Otp doesn't match. Please try again"
        }
    } else if (!stateObj.registrationStage) {
        console.log('stage3');
        const form = e.target
        let data = {
            email: form.email.value,
            otp: form.otp.value,
            password: form.password.value,
            name: form.name.value,
            phonenum: form.phonenum.value
        }
        const { success, err } = await reqListener('post', createUserEndpoint, data)
        if (success && success.success === true) {
            console.log('userCreated');
            document.getElementById('res-mssg').innerText = success.message
            stateObj.registrationStage = true
            document.getElementById('submit-btn').innerText = "Login"

        } else if (err) {
            document.getElementById('res-mssg').innerText = err
        }
    } else {
        document.location.href = "/signin"
    }
})