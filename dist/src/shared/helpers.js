export const ensureEnv = (key)=>{
    const value = process.env[key];
    if (!value) {
        throw new Error(`A variável de ambiente ${key} é obrigatória.`);
    }
    return value;
};

//# sourceMappingURL=helpers.js.map