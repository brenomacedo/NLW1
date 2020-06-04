import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Constants from 'expo-constants'
import { Feather as Icon, FontAwesome as FAIcon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import api from '../../services'

const Detail = () => {

  interface IParams {
    pointId: number
  }

  interface IData {
    point: {
      image: string
      name: string
      email: string
      whatsapp: string
      city: string
      uf: string
    },
    items: {
      title: string
    }[]
  }

  const [data, setData] = useState<IData>({} as IData)

  const navigation = useNavigation()
  const route = useRoute()

  const routeParmas = route.params as IParams

  useEffect(() => {
    api.get(`points/${routeParmas.pointId}`).then(resp => {
      setData(resp.data)
    }).catch(err => {})
  }, [])

  const handleNavigateBack = () => {
    navigation.goBack()
  }

  if(!data.point) {
    return null
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name='arrow-left' color='#34cb79' size={20} />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{
          uri: 'https://images.unsplash.com/photo-1560543899-58ce3bc3c8fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80'
        }} />

        <Text style={styles.pointName} >{data.point.name}</Text>
        <Text style={styles.pointItems} >{data.items.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>{data.point.city}</Text>
          <Text style={styles.addressContent}>{data.point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
          <RectButton style={styles.button} onPress={() => {}}>
            <FAIcon name='whatsapp' size={20} color='white' />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={() => {}}>
            <Icon name='mail' size={20} color='white' />
            <Text style={styles.buttonText}>Email</Text>
          </RectButton>
        </View>
    </>
  )
}

export default Detail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});