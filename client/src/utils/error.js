// handle error;
export const handleError = (error) => {
    const msg = error.response?.data?.message || "There is an error";
    console.log(msg);
    alert(msg);
}