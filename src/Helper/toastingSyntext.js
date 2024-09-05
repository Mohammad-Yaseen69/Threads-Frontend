export function toastingSytex(toast , status, title ,description) {
    toast({
        title,
        description,
        status,
        duration: 3000,
        isClosable: true,
    })
}

