import { Elevation, H5, Text } from '@blueprintjs/core'
import React, { forwardRef } from 'react'
import {
  CardBody,
  CardMedia,
  FlexCard
} from './style'
import { imgObj } from './image.es'

export const QuestCard = forwardRef(
  (
    {
      quest,
      ...props
    },
    ref
  ) => {
    const { code, name, desc, memo, memo2 } = quest
    const headIcon = imgObj[code[0]];

    return (
      <FlexCard
        ref={ref}
        elevation={Elevation.ZERO}
        interactive={false}
        {...props}
      >
        <CardMedia src={headIcon}></CardMedia>
        <CardBody>
          <H5>{[code, name].filter((i) => i != undefined).join(' - ')}</H5>
          <Text>{desc}</Text>
          {memo2 && <b>{memo2}</b>}
          {memo && <i>{memo}</i>}
        </CardBody>
      </FlexCard>
    )
  }
)