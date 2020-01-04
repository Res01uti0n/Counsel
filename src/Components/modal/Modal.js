import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../actions/modal.js';
import * as yup from 'yup';
import { Formik } from 'formik';
import { withTranslation } from 'react-i18next';
import propTypes from 'prop-types';
import axios from "axios";

class ModalForm extends React.Component {
  constructor(props) {
    super(props)
    this.t = this.props.t;
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  handleClose() {
    const {dispatch, show} = this.props;
    dispatch(closeModal(show));
  };

  handleShow() {
    const {dispatch, show} = this.props;
    dispatch(openModal(show));
  };

  render() {
    const {show} = this.props;
    
    return <Modal className="mt-5 pt-5" show={show} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{this.t("Fill this form and our manager will ask on all your questions")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormModal t={this.t} />
      </Modal.Body>
    </Modal>
  };
};

function FormModal({t}) {

  const schema = yup.object({
    firstName: yup.string()
      .min(2, 'Must be 2 characters or more')
      .max(15, 'Must be 15 characters or less')
      .required('Required field'),
    lastName: yup.string()
      .min(2, 'Must be 2 characters or more')
      .max(20, 'Must be 20 characters or less')
      .required('Required field'),
    email: yup.string()
      .email('Invalid email address')
      .required('Required field'),
    phone: yup.string()
      .matches( /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/ ,'Invalid format')
      .required('Required field'),
  });

  return (
    <Formik
      validationSchema={schema}
      onSubmit = {(values) => {
        axios.post('http://localhost:3001/users', values)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      }}
      initialValues={{
        firstName: '',
        lastName: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row className="d-felx justify-content-between pl-3 pr-3">
            <Form.Group md="4" controlId="validationFormik1">
              <Form.Label>{t("First name")}</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder={t("Your first name")}
                value={values.firstName}
                onChange={handleChange}
                isInvalid={!!errors.firstName}
                isValid={touched.firstName && !errors.firstName}
              />
              <Form.Control.Feedback>{t("Looks good!")}</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {t(errors.firstName)}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group md="4" controlId="validationFormik2">
              <Form.Label>{t("Second name")}</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder={t("Your second name")}
                value={values.lastName}
                onChange={handleChange}
                isInvalid={!!errors.lastName}
                isValid={touched.lastName && !errors.lastName}
              />
              <Form.Control.Feedback>{t("Looks good!")}</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {t(errors.lastName)}
              </Form.Control.Feedback>
            </Form.Group>   
          </Form.Row>
          <Form.Row className="pl-3 pr-3">
            <Form.Group className='w-100' controlId="validationFormik3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your.name@consel.com"
                name="email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback>{t("Looks good!")}</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {t(errors.email)}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row className="pl-3 pr-3">
            <Form.Group className='w-100' controlId="validationFormik4">
              <Form.Label>{t("Phone number")}</Form.Label>
              <Form.Control
                type="text"
                placeholder="1 231 345 57 22"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                isValid={touched.phone && !errors.phone}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback>{t("Looks good!")}</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {t(errors.phone)}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Button className="ml-2" type="submit">{t("Submit form")}</Button>
        </Form>
      )}
    </Formik>
  );
};

ModalForm.propTypes = {
  show: propTypes.bool.isRequired,
  dispatch: propTypes.func.isRequired
};

ModalForm.defaultProps = {
  show: false,
};

const mapStateToProps = (state) => {
  const {stateModal} = state;
  const {show} = stateModal;
  return {
    show
  };
};

export default connect(mapStateToProps)(withTranslation()(ModalForm));