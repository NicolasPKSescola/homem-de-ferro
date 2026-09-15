import express from 'express';
import cors from 'cors';
import 'dotenv/config';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const PORT = process.env.PORT || 5500;
const modelo = 'openai/gpt-oss-120b';

const url_api = "https://api.groq.com/openai/v1/chat/completions&quot";

app.use(express.json());
app.use(cors());

const user = [];

app.get('/', (req, res)=>{
    return res.json(user);
})

app.post('/cadastro', (req, res)=>{
    const {usuario, email, senha} = req.body;

    if (!usuario || !email || !senha) {
        return res.status(400).json({
            erro: "Preencha todos os campos"
        });
    }

    if (senha.length < 6) {
        return res.status(400).json({
            erro: "A senha deve ter 6 caracteres ou mais"
        });
    }

    const emailUsado = user.find((busca) => busca.email === email);

    if (emailUsado) {
        return res.status(409).json({
            erro: "Email já está em uso"
        });
    }

    console.log(`Recebido, aguarde 5 segundo`);

    user.push(usuario, email, senha);

    setTimeout(()=>{
        console.log(`Cadastrado o ${usuario} com o Email ${email}`);

        res.json({
            mensagem: "Cadastrado com Sucesso!!",
            perfil: `Perfil ${usuario} cadastrado com o email ${email}`
        });
    }, 5000);
});

app.post('/login', (req, res)=>{
    const {email, senha} = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({erro:"Preencha todos os campos"});
    }

    const emailExiste = user.find((busca)=> busca.email.toLowerCase() === email.toLowerCase());

    if (!emailExiste || emailExiste.senha != senha) {
        return res.status(400).json({erro:"Email ou senha incorretos!"});
    }

    return res.json({
        mensagem: "Login realizado com Sucesso!!",
        usuario: emailExiste.email
    });
})

app.post('/chat', (req, res)=>{
    try {
        const API_KEY = process.env.GROQ_API_KEY;
        const historico = req.body.historico || [];

        const persona = [
            {
                "role": "system",
                "content": "Você é Tony Stark, responda como um bilhonario de forma curta e objetiva"
            }
        ];

        persona.push(...historico);
    } catch (erro) {
        
    }
});

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
});