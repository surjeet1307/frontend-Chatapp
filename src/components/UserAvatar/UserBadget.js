import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/react'
import React from 'react'

function UserBadget({user,handleFun,admin}) {
  return (
    <Badge
    paddingX={2}
    paddingY={1}
    borderRadius="lg"
    margin={1}
    marginBottom={2}
    variant="solid"
    fontSize={12}
    colorScheme="purple"
    cursor="pointer"
    onClick={handleFun}
  >
    {user.name}
    {admin === user._id && <span> (Admin)</span>}
    <CloseIcon pl={1} />
  </Badge>
  )
}

export default UserBadget