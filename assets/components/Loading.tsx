import React, { Component } from 'react'
import Spinner from 'react-spinner-material'

export default class Loading extends Component {
  render() {
    return (
      <div>
        <Spinner radius={80} color={'#333'} stroke={10} visible={true} />
      </div>
    )
  }
}
