import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import {
  Input, Form, Row, Col, FormGroup, Button, FormFeedback, Label, Card, CardText, CardBody, CardLink, CardHeader,
  CardTitle, CardSubtitle
} from "reactstrap";
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux'
import curriculoActions from '../../store/actions/curriculoActions'
import axios from "axios";
import { api_curriculo } from '../../services/api'

export default function DadosPrincipais() {
  const curriculoReducer = useSelector(state => state.curriculoReducer)
  const [editMode, setEditMode] = useState(false)
  const dispatch = useDispatch()
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  }

  const formik = useFormik({
    initialValues: {
      nome: '',
      email: '',
      idade: '',
      telefone: '',
      dataNascimento: '',
      sexo: '',
      estadoCivil: '',
      nacionalidade: '',
      cep: '',
      logradouro: '',
      numeroCasa: '',
      bairro: '',
      cidade: '',
      uf: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('Nome obrigatório'),
      email: yup.string().required('Email obrigatório'),
      idade: yup.string().required('Idade obrigatória'),
      telefone: yup.string().required('Telefone de telefone obrigatório'),
      dataNascimento: yup.string().required('Data de Nascimento obrigatório'),
      sexo: yup.string().required('Sexo obrigatório'),
      estadoCivil: yup.string().required('Estado Civil obrigatório'),
      nacionalidade: yup.string().required('Nacionalidade obrigatório'),
      cep: yup.string().required('CEP obrigatório'),
      logradouro: yup.string().required('Logradouro obrigatório'),
      numeroCasa: yup.string().required('Nº da Casa obrigatório'),
      bairro: yup.string().required('Barrio obrigatório'),
      cidade: yup.string().required('Cidade obrigatório'),
      uf: yup.string().required('Estado (UF) obrigatório'),
    }),
  });
  //função que consulta o cep
  const bucas_cep = (ev, setFieldValue) => {
    const { value } = ev.target;
    const cep = value?.replace(/[^0-9]/g, '');
    if (cep?.length !== 8) {
      return;
    }
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setFieldValue('logradouro', data.logradouro);
        setFieldValue('bairro', data.bairro);
        setFieldValue('cidade', data.localidade);
        setFieldValue('uf', data.uf);
      });
  }
  // função que calcula a idade, capturando a data fornecida no campo de dataNascimento.
  const calc_idade = (setFieldValue) => {
    const dataInfo = formik.values.dataNascimento;
    const anoAtual = new Date().getFullYear();
    const dataInfoParts = dataInfo.split('-');
    const anoNasc = dataInfoParts[0];
    const mesNasc = dataInfoParts[1];
    const diaNasc = dataInfoParts[2];
    let age = anoAtual - anoNasc;
    const mesAtual = new Date().getMonth() + 1;
    if (mesAtual < mesNasc) {
      setFieldValue('idade', age--);
    } else {
      if (mesAtual === mesNasc) {
        if (new Date().getDate() < diaNasc) {
          setFieldValue('idade', age--);
        }
      }
    }
    return setFieldValue('idade', age.toString());
  }

  const att_tabela = () => {
    const userID = sessionStorage.getItem('user_id')
    dispatch(curriculoActions.busca_curriculo(userID))
  }

  const envia_curriculo = () => {
    console.log(formik.values)
    axios.post(`${api_curriculo}/create`, {
      nome: formik.values.nome,
      email: formik.values.email,
      idade: formik.values.idade,
      telefone: formik.values.telefone,
      dataNascimento: formik.values.dataNascimento,
      sexo: formik.values.sexo,
      civil: formik.values.estadoCivil,
      nacionalidade: formik.values.nacionalidade,
      cep: formik.values.cep,
      logradouro: formik.values.logradouro,
      numeroCasa: formik.values.numeroCasa,
      bairro: formik.values.bairro,
      cidade: formik.values.cidade,
      estado: formik.values.uf,
    }, { headers })
      .then(res => {
        setEditMode(false)
        // console.log('enviado com sucesso')
      }).catch(err => {
        // console.log(err)
      })
  };

  const btnDeletar = (id_curriculo) => {
    axios.delete(`${api_curriculo}/delete/${id_curriculo}`, { headers })
      .then(res => {
        // att_tabela()
        setEditMode(true)
        // console.log('curriculo apagado com sucesso')
      }).catch(err => {
        // console.log(err + 'falha ao apagar curriculo')
      })
  }

  // if (editMode == true) {
  //   setEditMode(false)
  // } else { 
    
  // }


  // preenche os dados q estão no reducer para os inputs do formulário
  useEffect(() => {
    if (curriculoReducer.show_curriculo && curriculoReducer.show_curriculo.curriculo) {
      setEditMode(false)
      formik.setFieldValue('nome', curriculoReducer.show_curriculo.curriculo.nome ? curriculoReducer.show_curriculo.curriculo.nome : '')
      formik.setFieldValue('email', curriculoReducer.show_curriculo.curriculo.email ? curriculoReducer.show_curriculo.curriculo.email : '')
      formik.setFieldValue('telefone', curriculoReducer.show_curriculo.curriculo.telefone ? curriculoReducer.show_curriculo.curriculo.telefone : '')
      formik.setFieldValue('idade', curriculoReducer.show_curriculo.dataInicio ? curriculoReducer.show_curriculo.curriculo.dataInicio : '')
      formik.setFieldValue('dataNascimento', curriculoReducer.show_curriculo.curriculo.dataNascimento ? curriculoReducer.show_curriculo.curriculo.dataNascimento : '')
      formik.setFieldValue('sexo', curriculoReducer.show_curriculo.curriculo.sexo ? curriculoReducer.show_curriculo.curriculo.sexo : '')
      formik.setFieldValue('estadoCivil', curriculoReducer.show_curriculo.curriculo.civil ? curriculoReducer.show_curriculo.curriculo.civil : '')
      formik.setFieldValue('nacionalidade', curriculoReducer.show_curriculo.curriculo.nacionalidade ? curriculoReducer.show_curriculo.curriculo.nacionalidade : '')
      formik.setFieldValue('cep', curriculoReducer.show_curriculo.curriculo.cep ? curriculoReducer.show_curriculo.curriculo.cep : '')
      formik.setFieldValue('logradouro', curriculoReducer.show_curriculo.curriculo.logradouro ? curriculoReducer.show_curriculo.curriculo.logradouro : '')
      formik.setFieldValue('numeroCasa', curriculoReducer.show_curriculo.curriculo.casa ? curriculoReducer.show_curriculo.curriculo.casa : '')
      formik.setFieldValue('bairro', curriculoReducer.show_curriculo.curriculo.bairro ? curriculoReducer.show_curriculo.curriculo.bairro : '')
      formik.setFieldValue('cidade', curriculoReducer.show_curriculo.curriculo.cidade ? curriculoReducer.show_curriculo.curriculo.cidade : '')
      formik.setFieldValue('uf', curriculoReducer.show_curriculo.curriculo.estado ? curriculoReducer.show_curriculo.curriculo.estado : '')
    } else {
      setEditMode(true)
    }
  }, [curriculoReducer.show_curriculo])

  return editMode ? (<>
  <CardHeader className="bg-white border-0">
    <Row className="align-items-center">
      <Col xs="8">
        <h3 className="mb-0">Meu Curriculo</h3>
      </Col>
    </Row>
  </CardHeader>
    <Form>
      <CardText className="heading-small text-muted mb-4">Dados Principais</CardText>
      <div> {/* Dados Principais */}
        <Row>
          <Col lg="5">
            <FormGroup>
              <Label className="form-control-label required" htmlFor="name">Nome</Label>
              <Input className="form-control-alternative" id="nome" placeholder="Nome" type="text"
                invalid={formik.touched.nome && formik.errors.nome ? true : false}
                {...formik.getFieldProps('nome')} />
              <FormFeedback>{formik.touched.nome && formik.errors.nome ? formik.errors.nome : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="4">
            <FormGroup>
              <Label className="form-control-label required" htmlFor="email">Email</Label>
              <Input className="form-control-alternative" id="email" placeholder="examplo@email.com" type="email"
                invalid={formik.touched.email && formik.errors.email ? true : false}
                {...formik.getFieldProps('email')} />
              <FormFeedback>{formik.touched.email && formik.errors.email ? formik.errors.email : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="3">
            <FormGroup>
              <Label className="form-control-label required" htmlFor="sexo">Sexo</Label>
              <Input className="form-control-alternative" id="sexo" type="select" data-trigger=""
                invalid={formik.touched.sexo && formik.errors.sexo ? true : false}
                {...formik.getFieldProps('sexo')}>
                <option value={null}>Gênero</option>
                <option value="1">Masculino</option>
                <option value="2">Feminino</option>
              </Input>
              <FormFeedback>{formik.touched.sexo && formik.errors.sexo ? formik.errors.sexo : null}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <FormGroup>
              <Label className=" form-control-label required" htmlFor="telefone">telefone</Label>
              <Input className="form-control-alternative" id="telefone" type="text" placeholder="(69) 9 9999-9999"
                invalid={formik.touched.telefone && formik.errors.telefone ? true : false}
                {...formik.getFieldProps('telefone')} />
              <FormFeedback>{formik.touched.telefone && formik.errors.telefone ? formik.errors.telefone : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="4">
            <FormGroup>
              <Label className=" form-control-label required" htmlFor="dataNascimento">Date de Nascimento</Label>
              <Input className="form-control-alternative" id="dataNascimento" type="date"
                invalid={formik.touched.dataNascimento && formik.errors.dataNascimento ? true : false}
                {...formik.getFieldProps('dataNascimento')}
                onBlur={() => calc_idade(formik.setFieldValue)}
              />
              <FormFeedback>{formik.touched.dataNascimento && formik.errors.dataNascimento ? formik.errors.dataNascimento : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="2">
            <FormGroup>
              <Label className=" form-control-label required" htmlFor="idade">Idade</Label>
              <Input className="form-control-alternative" id="idade" type="text" disabled
                {...formik.getFieldProps('idade')}
                invalid={formik.touched.idade && formik.errors.idade ? true : false} />
              <FormFeedback>{formik.touched.idade && formik.errors.idade ? formik.errors.idade : null}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <FormGroup>
              <Label className=" form-control-label required" htmlFor="estadoCivil">Estado Civil</Label>
              <Input className="form-control-alternative" id="estadoCivil" type="select"
                invalid={formik.touched.estadoCivil && formik.errors.estadoCivil ? true : false}
                {...formik.getFieldProps('estadoCivil')}>
                <option value={null}>Est. Civil</option>
                <option value="Solteiro">Solteiro(a)</option>
                <option value="Casado">Casado(a)</option>
                <option value="Viúvo">Viúvo(a)</option>
                <option value="Divorciado">Divorciado(a)</option>
              </Input>
              <FormFeedback>{formik.touched.estadoCivil && formik.errors.estadoCivil ? formik.errors.estadoCivil : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="4">
            <FormGroup>
              <Label className=" form-control-label required" htmlFor="nacionalidade">Nacionalidade</Label>
              <Input className="form-control-alternative" id="nacionalidade" type="text" placeholder="País"
                invalid={formik.touched.nacionalidade && formik.errors.nacionalidade ? true : false}
                {...formik.getFieldProps('nacionalidade')} />
              <FormFeedback>{formik.touched.nacionalidade && formik.errors.nacionalidade ? formik.errors.nacionalidade : null}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
      </div>
      <hr className="line-primary"></hr>
      <CardText className="heading-small text-muted mb-4">Endereço</CardText>
      <div> {/* Endereço */}
        <Row>
          <Col lg="3">
            <FormGroup>
              <Label className="form-control-label required" htmlFor="cep">CEP</Label>
              <Input className="form-control-alternative" id="cep" placeholder="CEP" type="text"
                {...formik.getFieldProps('cep')}
                invalid={formik.touched.cep && formik.errors.cep ? true : false}
                onBlur={(ev) => bucas_cep(ev, formik.setFieldValue)} />
              <FormFeedback>{formik.touched.cep && formik.errors.cep ? formik.errors.cep : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="3">
            <FormGroup>
              <Label className="form-control-label required" htmlFor="logradouro">Logradouro</Label>
              <Input className="form-control-alternative" id="logradouro" placeholder="Logradouro" type="text" disabled
                {...formik.getFieldProps('logradouro')}
                invalid={formik.touched.logradouro && formik.errors.logradouro ? true : false} />
              <FormFeedback>{formik.touched.logradouro && formik.errors.logradouro ? formik.errors.logradouro : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="2">
            <FormGroup>
              <Label className="form-control-label required" htmlFor="numeroCasa">Nº Casa</Label>
              <Input className="form-control-alternative" id="numeroCasa" placeholder="nº casa" type="text"
                invalid={formik.touched.numeroCasa && formik.errors.numeroCasa ? true : false}
                {...formik.getFieldProps('numeroCasa')} />
              <FormFeedback>{formik.touched.numeroCasa && formik.errors.numeroCasa ? formik.errors.numeroCasa : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="3">
            <FormGroup>
              <Label className=" form-control-label required" htmlFor="bairro">Bairro</Label>
              <Input className="form-control-alternative" id="bairro" placeholder="Bairro" type="text" disabled
                {...formik.getFieldProps('bairro')}
                invalid={formik.touched.bairro && formik.errors.bairro ? true : false} />
              <FormFeedback>{formik.touched.bairro && formik.errors.bairro ? formik.errors.bairro : null}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg="3">
            <FormGroup>
              <Label className=" form-control-label required" htmlFor="cidade">Cidade</Label>
              <Input className="form-control-alternative" id="cidade" placeholder="Cidade" type="text" disabled
                {...formik.getFieldProps('cidade')}
                invalid={formik.touched.cidade && formik.errors.cidade ? true : false} />
              <FormFeedback>{formik.touched.cidade && formik.errors.cidade ? formik.errors.cidade : null}</FormFeedback>
            </FormGroup>
          </Col>
          <Col lg="3">
            <FormGroup>
              <Label className=" form-control-label required" htmlFor="uf">UF</Label>
              <Input className="form-control-alternative" id="uf" placeholder="UF" type="select" disabled
                invalid={formik.touched.uf && formik.errors.uf ? true : false}
                {...formik.getFieldProps('uf')}>
                <option value={null}>UF</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AM">Amazonas</option>
                <option value="AP">Amapá</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MG">Minas Gerais</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MT">Mato Grosso</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="SC">Santa Catarina</option>
                <option value="SE">Sergipe</option>
                <option value="SP">São Paulo</option>
                <option value="TO">Tocantins</option>
              </Input>
              <FormFeedback>{formik.touched.uf && formik.errors.uf ? formik.errors.uf : null}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
      </div>
      <hr className="line-primary"></hr>
      <Button
        className="btn-icon float-right mb-2"
        color="success"
        onClick={envia_curriculo}>
        <span className="btn-inner--icon">
          <i className="ni ni-check-bold ml--2" />
        </span>
        <span className="btn-inner--text ml-2">Salvar</span>
      </Button>
      <Button
        className="btn-icon float-right mb-2"
        color="success"
        onClick={() => { setEditMode(false)}}>
        <span className="btn-inner--icon">
          <i className="ni ni-check-bold ml--2" />
        </span>
        <span className="btn-inner--text ml-2">Teste</span>
      </Button>
    </Form>
  </>)
    :
    curriculoReducer.show_curriculo?.curriculo? (
      <>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h3>{curriculoReducer.show_curriculo.curriculo.nome}</h3>
            <span>{curriculoReducer.show_curriculo.curriculo.logradouro}, {curriculoReducer.show_curriculo.curriculo.bairro}</span>

            <span>{curriculoReducer.show_curriculo.curriculo.cidade} - {curriculoReducer.show_curriculo.curriculo.estado}, {curriculoReducer.show_curriculo.curriculo.cep}</span>

            <span>{curriculoReducer.show_curriculo.curriculo.telefone}, {curriculoReducer.show_curriculo.curriculo.email}</span>

            <span>{curriculoReducer.show_curriculo.curriculo.nacionalidade} | {curriculoReducer.show_curriculo.curriculo.civil}</span>


            <hr />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', width: '100%', marginLeft: 30 }}>
              <b>OBJETIVO:</b><p> Descrição do objetivo. </p><br />
              <b>RESUMO DE QUALIFICAÇÕES:</b>
              <p> Descrição do objetivo. </p><br />
              <b>FORMAÇÕES ACADÊMICAS:</b>
              <div style={{ display: 'flex' }}>
                {curriculoReducer.show_curriculo?.formacoes ? curriculoReducer.show_curriculo.formacoes.map((item, idx) => (
                  <ul key={idx}>
                    <li>
                      <strong>Curso: </strong> {item.curso} <br />
                      <strong>Início: </strong> {item.dataInicio}<br />
                      <strong>Término: </strong>{item.dataTermino}<br />
                      <strong>Período: </strong>{item.periodo}º<br />
                      <strong>Turno: </strong>{item.turno}<br />
                      <strong>Status: </strong>{item.status}
                    </li>
                  </ul>
                )) : null}
              </div><br />
              <b>CURSOS:</b>
              <div style={{ display: 'flex' }}>
                {curriculoReducer.show_curriculo?.conhecimento ? curriculoReducer.show_curriculo?.conhecimento.map((item, idx) => (
                  <ul key={idx}>
                    <li>
                      <strong>Curso: </strong> {item.cursoAdicional} <br />
                      <strong>Nível: </strong> {item.nivel}<br />
                    </li>
                  </ul>
                )) : null}
              </div><br />
              <b>Documentos Adicionais:</b>
              <div style={{ display: 'flex' }}>
                {curriculoReducer.show_curriculo?.conhecimento ? curriculoReducer.show_curriculo?.conhecimento.map((item, idx) => (
                  <ul key={idx}>
                    <li>
                      <strong>Documento Adicional: </strong> {item.docAdicional} <br />
                    </li>
                  </ul>
                )) : null}
              </div>
            </div>

            <Button
              className="btn-icon float-right mb-2"
              color="success"
              onClick={() => setEditMode(true)}>
              <span className="btn-inner--icon">
                <i className="ni ni-check-bold ml--2" />
              </span>
              <span className="btn-inner--text ml-2">Editar</span>
            </Button>
            <Button className="mb-3" color="danger" type="button" onClick={() =>btnDeletar(curriculoReducer.show_curriculo.curriculo._id)}>
              <span className="btn-inner--text ml-2">Apagar Currículo</span>
            </Button>
            
          </div>
        </Card>
      </>
    ) :

    (
      <>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h3>Nenhum currículo cadastrado!</h3>

            <hr />
           
            <Button
              className="btn-icon float-right mb-2"
              color="success"
              onClick={() => setEditMode(true)}>
              <span className="btn-inner--icon">
                <i className="ni ni-check-bold ml--2" />
              </span>
              <span className="btn-inner--text ml-2">Cadastrar Currículo</span>
            </Button>
            
          </div>
        </Card>
      </>
    )



}