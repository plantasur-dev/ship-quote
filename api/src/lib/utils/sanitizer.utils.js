
export const sanitizer = (data) => {

    const dataSanitizer = { ...data };
    
    delete dataSanitizer?.password;

    return dataSanitizer;
};