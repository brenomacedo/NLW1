import React, { useEffect, useState, ChangeEvent } from 'react'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
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

    const [items, setItems] = useState<IItems[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState('0')
    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState('0')

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

    const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
        const uf = event.target.value

        setSelectedUf(uf)
    }

    const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
        const city = event.target.value

        setSelectedCity(city)
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/"><FiArrowLeft />Voltar Para Home</Link>
            </header>

            <form>
                <h1>Cadastro do ponto <br /> de coleta.</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="id"/>
                    </div>
                    
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">Email</label>
                            <input type="email" name="email" id="email"/>
                        </div>

                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp"/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map zoom={15} center={[ -3.7901373, -38.5189372 ]}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={[ -3.7901373, -38.5189372 ]} />
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
                            <li key={item.id}>
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