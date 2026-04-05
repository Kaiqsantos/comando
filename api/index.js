export default function handler(req, res) {
  const query = req.query.q || '';

  let resposta = "";
  
  if (query.toLowerCase() === "ola") {
    resposta = "Olá! Este é um comando processado fora do Nightbot!";
  } else {
    resposta = `Você disse: ${query}. Meu código gigante processou isso na Vercel!`;
  }
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(resposta);
}
