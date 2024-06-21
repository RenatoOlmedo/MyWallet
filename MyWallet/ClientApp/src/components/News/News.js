import { useEffect, useState } from "react"
import { ModalNews } from "../Modal/ModalNews"

export const News = () =>{

    const [news, setNews] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [idNews, setIdNews] = useState("");
    const [type, setType] = useState("");
    const [newsUpdate, setNewsUpdate]=useState({
        idNews:"",
        titleNews:"",
        bodyNews:""
    })

    async function getNews(){
        const news = await fetch('/News', {
            method:'GET'
        })
        const data = await news.json();
        return data;
    }

    useEffect(()=>{

        async function initialize(){
            var noticias = await getNews();
            setNews(noticias);
        }
        initialize()
    },[])

    function abreModal(item, type){
        setModalOpen(true)
        setType(type);
        setNewsUpdate({
            newsId:item.newsId,
            title:item.title,
            body:item.body
        })
    }
    function fecharModal(){
        setModalOpen(false)
    }

    return (
        <>
          {
            news ? 
          <>
            <ModalNews onClose={fecharModal} open={modalOpen} typeProps={type} itemProps={newsUpdate} ></ModalNews>
            <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 mb-5 text-end">
                    <button onClick={()=>{abreModal(0, 'add')}} className="btn btn-primary">Adicionar notícia</button>
                </div>
            <div class="col-12">
           <div class="table-responsive">
            <table class="table table-striped table-hover mt-5">
                <thead>
                    <tr>
                        <th class="" width="25%" colspan="4">Título</th>
                        <th class="" width="25%" colspan="4">Notícia</th>
                        <th class="text-center" width="25%" colspan="4">#</th>
                        <th class="text-center" width="25%" colspan="4">#</th>

                    </tr>
                    </thead>
                    {news.map((item, index) =>(
                        <tr>
                            <td colSpan={4}>{item.title}</td>
                            <td className="news-body" colSpan={4}>{item.body}</td>
                            <td colSpan={4} className="text-center">
                                <button onClick={()=>{abreModal(item, "update")}} className="btn btn-secondary">Editar</button>
                            </td>
                            <td colSpan={4} className="text-center">
                            <button className="btn  delete"></button>
                            </td>
                        </tr>
                    ))}
                
            </table>
           </div>
        </div>
            </div>
        </div>
        </>
        :
        ''
          }
        </>
    )
} 