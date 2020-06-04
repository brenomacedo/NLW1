import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'
import api from '../../services/api'
import './styles.css'

const CreatePoint = () => {

    interface IItems {
        id: number
        title: string
        image_url: string
    }

    interface IUF {
        sigla: string
    }

    interface ICity {
        nome: string
    }

    interface IForm {
        name: string
        email: string
        whatsapp: string
    }

    const history = useHistory()

    const [items, setItems] = useState<IItems[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState('0')
    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectPosition, setSelectedPosition] = useState<[number, number]>([0,0])
    const [userPosition, setUserPosition] = useState<[number, number]>([0,0])
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [formData, setFormData] = useState<IForm>({
        name: '',
        email: '',
        whatsapp: ''
    })

    useEffect(() => {
        api.get('items').then(resp => {
            setItems(resp.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(resp => {
                const ufInitials = resp.data.map(uf => uf.sigla)
                setUfs(ufInitials)
            })
    }, [])

    useEffect(() => {
        if(selectedUf === '0') {
            return
        }

        axios.get<ICity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(resp => {
                const cityNames = resp.data.map(city => city.nome)
                setCities(cityNames)
            })

    }, [selectedUf])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserPosition([position.coords.latitude, position.coords.longitude])
        })
    }, [])

    const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
        const uf = event.target.value

        setSelectedUf(uf)
    }

    const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
        const city = event.target.value

        setSelectedCity(city)
    }

    const handleMapClick = (event: LeafletMouseEvent) => {
        setSelectedPosition([event.latlng.lat, event.latlng.lng])
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [event.target.name]: event.target.value})
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

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectPosition
        const items = selectedItems

        const data = { name, email, whatsapp, uf, city, latitude, longitude, items }

        api.post('points', data)

        history.push('/success')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/"><FiArrowLeft />Voltar Para Home</Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do ponto <br /> de coleta.</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="id" onChange={handleInputChange}/>
                    </div>
                    
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">Email</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}/>
                        </div>

                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map zoom={15} center={userPosition} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectPosition} />
                    </Map>

                    <div className="field-group">
                    <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione um Estado (UF)</option>
                                {ufs.map((uf, index) => (
                                    <option key={index} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select value={selectedCity} onChange={handleSelectCity} name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixos</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li className={selectedItems.includes(item.id) ? 'selected' : ''} key={item.id} onClick={() => handleSelectItem(item.id)}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint