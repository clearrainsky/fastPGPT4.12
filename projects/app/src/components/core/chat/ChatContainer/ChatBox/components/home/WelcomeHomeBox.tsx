import { ChatBoxContext } from '@/components/core/chat/ChatContainer/ChatBox/Provider';
import { DEFAULT_LOGO_BANNER_URL } from '@/pageComponents/chat/constants';
import { Box, Flex, Image } from '@chakra-ui/react';
import { useContextSelector } from 'use-context-selector';

const WelcomeHomeBox = () => {
  const wideLogo = useContextSelector(ChatBoxContext, (v) => v.wideLogo);
  const slogan = useContextSelector(ChatBoxContext, (v) => v.slogan);
  const logoSrc = wideLogo || DEFAULT_LOGO_BANNER_URL;

  return (
    <Flex flexDir="column" justifyContent="flex-end" alignItems="center" gap={4}>
      {logoSrc && (
        <Image alt="logo" maxW={['200px', '300px']} src={logoSrc} fallbackSrc={logoSrc} />
      )}
      <Box color="myGray.500">{slogan}</Box>
    </Flex>
  );
};

export default WelcomeHomeBox;
