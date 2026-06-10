import ExternalAPI from '@server/api/externalapi';
import cacheManager from '@server/lib/cache';

export interface IMDBRating {
  title: string;
  url: string;
  criticsScore: number;
  criticsScoreCount: number;
}

/**
 * Self-hosted IMDb sidecar client.
 * Reads base URL from IMDB_SIDECAR_URL env var,
 * defaulting to http://imdb-sidecar:3001.
 */
class IMDBRadarrProxy extends ExternalAPI {
  constructor() {
    super(
      process.env.IMDB_SIDECAR_URL ?? 'http://imdb-sidecar:3001',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        nodeCache: cacheManager.getCache('imdb').data,
      }
    );
  }

  public async getMovieRatings(IMDBid: string): Promise<IMDBRating | null> {
    try {
      const data = await this.get<IMDBRating>(
        `/api/ratings/movie/${IMDBid}`
      );
      return data ?? null;
    } catch (e) {
      throw new Error(
        `[IMDB SIDECAR API] Failed to retrieve movie ratings: ${e.message}`,
        { cause: e }
      );
    }
  }

  public async getTvRatings(IMDBid: string): Promise<IMDBRating | null> {
    try {
      const data = await this.get<IMDBRating>(
        `/api/ratings/tv/${IMDBid}`
      );
      return data ?? null;
    } catch (e) {
      throw new Error(
        `[IMDB SIDECAR API] Failed to retrieve TV ratings: ${e.message}`,
        { cause: e }
      );
    }
  }
}

export default IMDBRadarrProxy;
