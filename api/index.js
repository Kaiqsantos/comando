export default async function handler(req, res) {
  const teamId = req.query.id || '5';
  const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${teamId}`);
  const data = await response.json();

  const nextEvent = data.team.nextEvent?.[0];

  const competitors = nextEvent.competitions[0].competitors;
  const localizacao = nextEvent.competitions[0].venue;
  const bocaIndex = competitors[0].id == teamId ? 0 : 1; 
  const time = competitors[bocaIndex];
  const adversario = competitors[1 - bocaIndex];
  const dateObj = new Date(nextEvent.date);
  const nome = teamId === '5' ? "💙Boca💛" : teamId === '3457' ? "❤️Vitoria🖤" : teamName;
  const dateOptions = { timeZone: 'America/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' };
  const timeOptions = { timeZone: 'America/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false };
  
  const dateStr = new Intl.DateTimeFormat('pt-BR', dateOptions).format(dateObj);
  const timeStr = new Intl.DateTimeFormat('pt-BR', timeOptions).format(dateObj);

  const isHome = time.homeAway === 'home' || time.homeAway[0] === 'h';
  const homeAwayStr = isHome ? "🏟 local" : "✈ visitante";

  const result = `⚽ El próximo partido de ${nome} será ${dateStr} a las ${timeStr}hrs como ${homeAwayStr} en ${localizacao.fullName} en la ciudad de ${localizacao.address.city}-${localizacao.address.country} contra ${adversario.team.displayName} válido por ${nextEvent.seasonType.abbreviation} de ${nextEvent.season.displayName}⚽`;
  // f"A próxima partida do {time['team']['displayName']} será {data_br:%d/%m/%Y} às {data_br:%H:%M}hrs como {'mandante' if time['homeAway']=='home' else 'visitante'}
  // no {next_event['competitions'][0]['venue']['fullName']} contra o {adversario['team']['displayName']} em
  // {next_event['competitions'][0]['venue']['address']['city']}-{next_event['competitions'][0]['venue']['address']['country']} válido pela {next_event['seasonType']['abbreviation']} da {next_event['season']['displayName']}"

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.status(200).send(result);

}
