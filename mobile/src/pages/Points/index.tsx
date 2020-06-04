import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import api from '../../services'

const Points = () => {

  interface IItems {
    id: number
    title: string
    image_url: string
  }

  const [items, setItems] = useState<IItems[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const navigation = useNavigation()

  useEffect(() => {
    api.get('items').then(res => {
      setItems(res.data)
    }).catch(err => {console.log(err)})
  }, [])

  const handleNavigateBack = () => {
    navigation.goBack()
  }

  const handleNavigateToDetail = () => {
    navigation.navigate('Detail')
  }

  const handleSelectItem = (id: number) => {
    const alreadySelected  = selectedItems.findIndex(item =>  item === id)
    if(alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(item => item !== id)
        setSelectedItems(filteredItems)
    } else {
        setSelectedItems([...selectedItems, id])
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name='arrow-left' color='#34cb79' size={20} />
        </TouchableOpacity>
        <Text style={styles.title}>
          Bem Vindo
        </Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta
        </Text>

        <View style={styles.mapContainer}>
          <MapView initialRegion={{ latitude: -3.7901373, longitude: -38.5189372,
          longitudeDelta: 0.014, latitudeDelta: 0.014 }} style={styles.map} >
            <Marker onPress={handleNavigateToDetail} style={styles.mapMarker} coordinate={{
              latitude: -3.7901373, longitude: -38.5189372
            }}>
              <View style={styles.mapMarkerContainer}>
                <Image style={styles.mapMarkerImage} source={{ uri: 'https://images.unsplash.com/photo-1560543899-58ce3bc3c8fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80' }} />
                <Text style={styles.mapMarkerTitle} >Mercado</Text>
              </View>
            </Marker>
          </MapView>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {items.map(item => {
            const uri = 'http://10.0.0.106:'+item.image_url.split(':')[2]
            return (
              <TouchableOpacity onPress={() => handleSelectItem(item.id)} activeOpacity={0.7} key={String(item.id)} style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : []]}>
                <SvgUri width={42} height={42} uri={uri} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            )
          })}

        </ScrollView>
      </View>
    </>
  )
}

export default Points

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});