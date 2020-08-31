const axios = require("axios");

const token = process.env.RIOT_TOKEN;
const endpoint = process.env.RIOT_ENDPOINT_EUNE;

const config = {
  headers: {
    "X-Riot-Token": token,
  },
};

module.exports = {
  /**
   * Retrieve a user avatar.
   *
   * @return {String}
   *
   */

  async find(ctx) {
    const profile = await axios.get(
      `${endpoint}/lol/summoner/v4/summoners/by-name/xRazvYx`,
      config
    );

    const league = await axios.get(
      `${endpoint}/lol/league/v4/entries/by-summoner/${profile.data.id}`,
      config
    );

    const summoner = {
      id: profile.data.id,
      name: profile.data.name,
      level: profile.data.summonerLevel,
      icon: profile.data.profileIconId,
      league: league.data,
    };

    ctx.send(summoner);
  },

  async games(ctx) {
    const profile = await axios.get(
      `${endpoint}/lol/summoner/v4/summoners/by-name/xRazvYx`,
      config
    );

    const games = await axios.get(
      `${endpoint}/lol/match/v4/matchlists/by-account/${profile.data.accountId}`,
      config
    );

    const { matches } = games.data;

    const stats = [];

    for (let counter = 0, len = matches.length; counter < len; counter++) {
      while (counter < 20) {
        try {
          if (matches[counter].queue == 440) {
            const { data } = await axios.get(
              `${endpoint}/lol/match/v4/matches/${matches[counter].gameId}`,
              config
            );

            for (let i = 0, len = data.participants.length; i < len; i++) {
              if (
                data.participants[i].championId == matches[counter].champion
              ) {
                stats.push(data.participants[i]);
              }
            }
          } else {
            break;
          }
        } catch (err) {
          console.log(err.response.status);
          continue;
        }

        break;
      }
    }

    return ctx.send(stats);
  },
};
