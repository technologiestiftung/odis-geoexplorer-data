![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Geoexplorer Data

This repository includes all logic around the data needed for the [GeoExplorer](https://github.com/technologiestiftung/odis-geoexplorer) - a AI-driven search application for Berlin's geo data. It contains:

- A Node.js **scraper** script to collect the data. [🔗](#scraper)
- A script to create and write **embeddings** to a DB using OpenAIs and Supabase APIs. [🔗](#embeddings)
- A script to run a Jupyter notebook to **analyze and export the embeddings**. [🔗](#notebook)

### Scraper<a id='scraper'></a>

The scraper (located in the [scraper folder](./scraper/)) gets all WFS & WMS related metadata from [Berlin's Open Data Portal](https://daten.berlin.de/) and [Berlin's Geo Data Portal (FisBroker)](https://fbinter.stadt-berlin.de/fb/) and writes a markdown file (.mdx) for each dataset. The scraper has multiple steps which you can control in the [index.js](./scraper/index.js) by (un)commenting them.

Before running the scraper you will need to install **npm** and the dependencies:

```code
npm i
```

Run the scraper like so:

```code
npm run scrape
```

Or if you want to update the data:

```code
npm run scrape:update
```

### Setting up a Supabase DB and creating embeddings<a id='embeddings'></a>

**1. Set up a local Supabase DB** (optional)

The initialization of the database, including the setup of the `pgvector` extension is stored in the [`supabase/migrations` folder](./supabase/migrations/) which is automatically applied to your local Postgres instance when running `npx supabase start`

Make sure you have **Docker** installed and running locally. Then run

```bash
npx supabase start
```

**2. Provide connection details**

Duplicate the `.env.example` file and rename it to `.env`. Then provide either your local connection details or those from Supabase, depending on where you want to save your data.

- To retrieve your local `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` run:

```bash
npx supabase status
```

You will also need to provide a key to use **OpenAI API**.

**3. Generate embeddings**

This script requests an embedding for each markdown file created earlier. The embedding will then be written to a DB. To run the script:

```bash
npm run embeddings
```

> Note: Make sure Supabase is running. To check, run `supabase status`. If is not running, run `supabase start`.

**4. Link your local development project to a hosted Supabase project** (optional)

You can do this like so (your data will not be uploaded):

```bash
npx supabase
npx supabase link SUPABASE_DB_PASSWORD
npx supabase login
npx supabase link --project-ref SUPABASE_DB_PASSWORD
npx supabase db push
```

### Running Jupyter notebook to analyze and export the embeddings.<a id='notebook'></a>

Go to your graphical interface of your Supabase DB (e.g., http://localhost:54323/project/default/editor) and export the _nods_page_section_rows_ table as a .csv file. Save the file in the [createGraph](/createGraph/) folder. Then install **jupyter notebook** via pip if you haven't installed it yet.

```code
pip install notebook
```

Run the notebook like so:

```code
npm run embedgraph
```

This will open a new window in your browser.

> You can also access the notebook directly via [http://localhost:8888/notebooks/embeds.ipynb](http://localhost:8888/notebooks/embeds.ipynb).

Run the notebook. It will show you a scatterplot representing the vectors in a 2D representation.

At the bottom of the notebook, you will find a link called _tsne_data.csv_. This will allow you to download the 2D coordinates including the titles of the dataset. The data is used to update the scatterplot displayed in the GeoExplorer.

> The Notebook script is based on [OpenAI guides](https://platform.openai.com/docs/guides/embeddings/use-cases).

## Contributing

Before you create a pull request, write an issue so we can discuss your changes.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Content Licensing

Texts and content available as [CC BY](https://creativecommons.org/licenses/by/3.0/de/).

## Credits

<table>
  <tr>
        <td>
      Made by: <a href="https://odis-berlin.de">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-odis-berlin.svg" />
      </a>
    </td>
    <td>
      Together with: <a href="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
      </a>
    </td>
    <td>
      A project by <a href="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-de.svg" />
      </a>
    </td>
    <td>
      Supported by <a href="https://www.berlin.de/rbmskzl/">
        <br />
        <br />
        <img width="80" src="https://logos.citylab-berlin.org/logo-berlin-senatskanzelei-de.svg" />
      </a>
    </td>
  </tr>
</table>

## Related Projects
