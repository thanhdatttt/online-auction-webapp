export const regex = {
    name: /^[A-Za-zÀ-ỹĐđ' -]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
    address: /^[A-Za-z0-9À-ỹĐđ\s,'./-]*$/,
    otp: /^\d+$/,
}