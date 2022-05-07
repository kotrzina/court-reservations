import {useState} from 'react';
import {FlashType, FlashVariant} from "../components/Flash";

type updateFlashFn = (v: FlashVariant, message: string) => void;
type useFlashReturn = [FlashType, updateFlashFn]

export function useFlash(): useFlashReturn {

    const [flash, setFlash] = useState<FlashType>({
        display: false,
        type: "ok",
        message: "",
    });

    function updateFlash(variant: FlashVariant, message: string) {
        setFlash({
            display: true,
            type: variant,
            message: message,
        })

        setTimeout(() => {
            setFlash({
                display: false,
                type: variant,
                message: message,
            })
        }, 10000)
    }

    return [flash, updateFlash];
}
