import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css'
import Pagination from '../components/Pagination'
import { args } from '../config/api';

interface IPropsComponent {
  list: any[]
  page: number
  total_pages: number
  search: boolean
  searchParam: string
}

const Home = ({ list, page, total_pages, searchParam }:
IPropsComponent) => {

  // Inicialização do state que armazena os dados da lista de filmes retornados pela API
  const [data, setData] = useState<any[]>([])
  const router = useRouter()

  // Inicialização do state que armazena o valor do input search
  const [search, setSearch] = useState(searchParam)

  // Inicialização do state que armazena o valor da propriedade searchParam
  const [result, setResult] = useState<undefined | string>(undefined)

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (search) {
      // Redirecionar para pagina passando os parametros search e value
      return router.push(`?search=${search}&page=${value}`)
    } else {
      return router.push(`?page=${value}`)
    }
  }

  async function handleSearchMovie(e: FormEvent<HTMLFormElement>) {
    // desabilitar o reload padrào do form
    e.preventDefault()
    return router.push(`/?search=${search}&page=1`)
  }

  useEffect(() => {

    // verifica se há alguma mudança no list, e então é armazenado o valor do list novamente
    setData(list)

    // verifica se há alguma mudança de estado no searchParam, caso sim ele seta o valor novamente
    setResult(searchParam)
  }, [list, searchParam])

  return (
    <div className={styles.container}>
      <Head>
        <title>Projeto aula NextJS MovieDB</title>
        <meta name="description" content="Gerado pelo create next app"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <div>
        <div className={styles.formSearch}>
          <form onSubmit={handleSearchMovie}>
            <input type="text" placeholder="Procure por um filme ou série..." onChange={(e) => setSearch(e.target.value)}/>
            <button type="submit">Pesquisar</button>
          </form>
        </div>

        <div className={styles.titleContainer}>
          {result ? (<h1>Resultados de busca para: {`${result}`}</h1>)
          : (<h1>Filmes Populares</h1>)}
        </div>

        <div className={styles.moviesCointainer}>
          {data.map((item: any, index: number) => (
            <div key={index}>
              <Image src={`http://image.tmdb.org/t/p/original${item.poster_path}`}
                alt="image movie"
                width={350}
                height={400}/>

              <div>
                {item.vote_average ? (
                  <p>
                    Nota: <span>{item.vote_average}</span>
                  </p>
                ) : (
                  <p>
                    Nota: <span>Sem avaliação</span>
                  </p>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>

      <div className={styles.paginationContainer}>
        <Pagination
          total_pages={total_pages}
          page={page}
          handleChange={handleChange}
        />
      </div>
    </div>
  )
}

export default Home

export async function getServerSideProps({
  query
}: {
  query: {
    page?: string
    search?: string
  }
}) {
  if (query.search) {
    // É efetuada uma requisição GET para o servidor, retornando os dados do filme que foi passado no query param search
    const response = await fetch(
      `${args.base_url}/search/movie?api_key=${args.api_key}&query=${query.search}&page=${query.page ? query.page : 1}&language=pt-BR`
    )

    const { results, page, total_pages } = (await response.json()) as any

    return {
      props: {
        list: results,
        page,
        total_pages,
        searchParam: query.search
      }
    }
  } else {
    const response = await fetch(
      `${args.base_url}/trending/movie/week?api_key=${args.api_key}&page=${query.page ? query.page : 1}&language=pt-BR`
    )

    const { results, page, total_pages } = (await response.json()) as any

    return {
      props: {
        list: results,
        page: page,
        total_pages: total_pages,
        searchParam: ""
      }
    }
  }
}



























