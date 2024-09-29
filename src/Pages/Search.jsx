import { Box, Button, Flex, FormLabel, Heading, Input, InputGroup, InputRightElement, Skeleton, SkeletonCircle, SkeletonText, useColorModeValue, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { makeRequest } from '../Utils/api';
import { UserProfileCard } from '../components';
import { toastingSytex } from '../Helper/toastingSyntext';

const Search = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const toast = useToast();
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true);
            const response = await makeRequest('users/suggested', {
                method: "GET",
                params: { moreUsers: true },
            });
            setSuggestedUsers(response.response.data);
            setLoading(false);
        };
        getSuggestedUsers();
    }, []);

    const handleSearch = async () => {
        if (!search) return;
        setSearchLoading(true);
        const response = await makeRequest('users/search', {
            method: "GET",
            params: { query: search },
        });
        if (response.error) {
            toastingSytex(toast, "Something went wrong", 'error');
        }
        setNoResults(!response.response?.data.length);
        setSearchResult(response.response?.data);
        setSearch('');
        setSearchLoading(false);
    };

    const renderSkeletons = () => (
        <Flex flexDirection={'column'} gap={3}>
            {Array(3).fill("").map((_, index) => (
                <Flex key={index} alignItems="center" justifyContent={'space-between'} gap={3}>
                    <Flex alignItems={'center'} width={'full'} gap={3}>
                        <SkeletonCircle flexShrink={0} size="10" />
                        <SkeletonText noOfLines={1} width={"70%"} />
                    </Flex>
                    <Skeleton height={'30px'} width={'90px'} borderRadius={'md'} />
                </Flex>
            ))}
        </Flex>
    );

    const renderUserProfileCards = (users) => (
        users.map(user => (
            <UserProfileCard
                display={user?.userName.length <= 15 ? "flex" : "none"}
                key={user?._id}
                userId={user?._id}
                userName={user?.userName}
                fullName={user?.name}
                avatar={user?.pfp?.url}
                followed={user?.isFollowed}
            />
        ))
    );

    console.log(noResults)

    return (
        <Flex flexDirection={'column'} minH={'100vh'}>
            <Box>
                <FormLabel fontSize={20}>Search Users</FormLabel>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}>
                    <InputGroup>
                        <Input
                            width={'full'}
                            bg={useColorModeValue("gray.light", "gray.dark")}
                            placeholder='Enter Username here'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputRightElement onClick={handleSearch} bg={'blue.500'} borderTopRightRadius={4} cursor={'pointer'} borderBottomRightRadius={4}>
                            <Button p={0} isLoading={searchLoading} m={0}>
                                <IoSearch />
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </form>
            </Box>

            {/* Conditionally render suggested users only if there's no search input */}
            {searchResult.length === 0 && noResults === false && (
                <Box mb={5} mt={4}>
                    {loading ? renderSkeletons() : (noResults ? <Heading as={'h2'} size={'sm'}>No User Found!</Heading> : renderUserProfileCards(suggestedUsers))}
                </Box>
            )}

            {searchResult.length > 0 && noResults === false && (
                <Box mb={5} mt={4}>
                    <Heading as="h3" size="md" mb={6}>Search Results</Heading>
                    {renderUserProfileCards(searchResult)}
                </Box>
            )}

            {searchResult.length === 0 && noResults === true && (
                <Box mb={5} mt={4}>
                    <Heading as="h3" size="md" mb={6}>No Users Found</Heading>
                </Box>
            )}
        </Flex>
    );
};

export default Search;