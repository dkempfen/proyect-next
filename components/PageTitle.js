import PropTypes from 'prop-types';

function PageTitle({ children = "Titulo de pagina" }) {
    return (
        <h2 className="mb-8 text-4xl font-bold text-primary">{children}</h2>
    );
}

PageTitle.propTypes = {
    children: PropTypes.node
};

export default PageTitle;