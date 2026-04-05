export default async function handler(req, res) {
  const teamId = req.query.id || '5';
  try {
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${teamId}`);
    const data = await response.json();

    const nextEvent = data.team.nextEvent?.[0];
    
    if (!nextEvent) {
      return res.status(200).send("⚽ No hay partidos programados para 💙Boca💛 en este momento. ⚽");
    }

    const competitors = nextEvent.competitions[0].competitors;
    const bocaIndex = competitors[0].id == teamId ? 0 : 1; 
    const time = competitors[bocaIndex];
    const opponent = competitors[1 - bocaIndex];
    const dateObj = new Date(nextEvent.date);
    
    const dateOptions = { timeZone: 'America/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions = { timeZone: 'America/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false };
    
    const dateStr = new Intl.DateTimeFormat('pt-BR', dateOptions).format(dateObj);
    const timeStr = new Intl.DateTimeFormat('pt-BR', timeOptions).format(dateObj);

    const isHome = time.homeAway === 'home' || time.homeAway[0] === 'h';
    const homeAwayStr = isHome ? "🏟 local" : "✈ visitante";

    const result = `⚽ El próximo partido de ${time.team.displayName} será ${dateStr} a las ${timeStr}hrs como ${homeAwayStr} en contra ${opponent.team.displayName} ⚽`;
    // f"A próxima partida do {time['team']['displayName']} será {data_br:%d/%m/%Y} às {data_br:%H:%M}hrs como {'mandante' if time['homeAway']=='home' else 'visitante'}
    // no {next_event['competitions'][0]['venue']['fullName']} contra o {adversario['team']['displayName']} em
    // {next_event['competitions'][0]['venue']['address']['city']}-{next_event['competitions'][0]['venue']['address']['country']} válido pela {next_event['seasonType']['abbreviation']} da {next_event['season']['displayName']}"

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(result);

  } catch (error) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(500).send("⚽ Error al obtener la información del partido. ⚽");
  }
}
