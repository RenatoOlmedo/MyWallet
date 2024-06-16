import { useState } from "react"

export const RetornoModal = ({corProps, openProps, textoProps}) =>
{
    // const [modalProps, setModalProps] = useState({
    //     cor:corProps,
    //     texto:textoProps,
    //     open:openProps
    // })
    return (
        <>
         <div className={`retornoFetch bg-${corProps} ${openProps ? '' : 'd-none'}`}><p className="text-white mb-0">{textoProps}</p></div>
        </>
    )
}