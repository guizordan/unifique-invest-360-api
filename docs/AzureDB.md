## Conectar ao Azure SQL com Microsoft Entra (Azure AD)

1.  **Portal Azure:**

    - Crie um Banco de Dados SQL e um Servidor (nível gratuito para teste).
    - Configure o firewall para permitir o acesso do seu IP local, se necessário.

2.  **Microsoft Entra ID:**

    - Registre um novo aplicativo.
    - Anote o **ID do Aplicativo (cliente)** e o **ID do Diretório (tenant)**.
    - Habilite a permissão `app_impersonation` para que o aplicativo tenha autorização para interagir com o Azure SQL Server.
    - Crie e guarde um **Segredo do Cliente**.

3.  **Portal Azure (Servidor SQL -> Autenticação Microsoft Entra):**
    - Pesquise e selecione o aplicativo registrado na etapa 2.
    - Adicione o aplicativo como administrador do servidor.
    - Clique em "Salvar".

**Na sua aplicação:** Utilize uma biblioteca MSAL para obter um token com as credenciais do aplicativo e use esse token para conectar ao Azure SQL Server, configurando o TypeORM como sua fonte de dados (`DataSource`).
