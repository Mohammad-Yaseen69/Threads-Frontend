import { Flex, Image, useColorMode } from '@chakra-ui/react'
import React from 'react'

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Flex justify={"center"} mt={6} mb={12}>
            <Image
                src={colorMode === "light" ? "../public/dark-logo.svg" : "../public/light-logo.svg"}
                w={6}
                alt='logo'
                onClick={toggleColorMode}
                cursor={"pointer"}
            />
        </Flex>
    )
}

export default Header
