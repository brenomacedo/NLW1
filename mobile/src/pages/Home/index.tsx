import React, { useEffect, useState } from 'react'
import { ImageBackground, View, StyleSheet, Image, Text, Alert } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Picker from 'react-native-picker-select'
import axios from 'axios'


const Home = () => {

  interface IUFs {
    sigla: string
  }

  interface ICities {
    nome: string
  }

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(resp => {
      setUfs(resp.data)
    })
  }, [])

  const [ufs, setUfs] = useState<IUFs[]>([])
  const [selectedUf, setSelectedUf] = useState('0')

  const [cities, setCities] = useState<ICities[]>([])
  const [selectedCity, setSelectedCity] = useState('0')

  const navigation = useNavigation()

  const handleNavigationToPoints = () => {
    if(selectedCity === '0' || selectedUf === '0') {
      Alert.alert('Selecione Sua Cidade e Seu Estado!')
      return
    }

    navigation.navigate('Points', {
      city: selectedCity,
      uf: selectedUf
    })
  }

  const handleStateChange = (event: any) => {
    setSelectedUf(event)
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${event}/municipios`)
      .then(resp => {
        setCities(resp.data)
      }).catch(err => {})
  }

  return (
    <ImageBackground source={require('../../assets/home-background.png')}
    imageStyle={{ width: 274, height: 368}} style={styles.container}>
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos as pessoas a encontrarem pontos de coleta de forma mais eficiente.</Text>
      </View>

      <View style={styles.footer}>

        <Picker value={selectedUf} placeholder={{ label: 'Selecione seu Estado', value: '0' }}
        items={ufs.map(uf => ({ label: uf.sigla, value: uf.sigla }))}
        onValueChange={handleStateChange} />

        <Picker value={selectedCity} disabled={selectedUf !== '0' ? false : true}
        placeholder={{ label: 'Selecione sua Cidade', value: '0' }}
        items={cities.map(city => ({ label: city.nome, value: city.nome }))}
        onValueChange={(city) => setSelectedCity(city)} />

        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon color='#fff' name='arrow-right' size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f0f0f5'
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});