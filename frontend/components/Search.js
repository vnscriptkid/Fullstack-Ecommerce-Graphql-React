import Downshift from 'downshift';
import {DropDown, DropDownItem, SearchStyles} from './styles/Dropdown';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { ApolloConsumer } from 'react-apollo';
import { Component } from 'react';
import Router from 'next/router';

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY(
        $searchTerm: String!
    ) {
        items(
            where: {
                OR: [
                    {title_contains: $searchTerm},
                    {description_contains: $searchTerm}
                ]
            }
        ) {
            id,
            title,
            image
        }
    }
`;


class AutoComplete extends Component {

    state = {
        items: [],
        loading: false
    }
    
    update = debounce(async ({ event, client }) => {
        this.setState({ loading: true })
        const res = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: {
                searchTerm: event.target.value
            }
        });
        this.setState({ items: res.data.items, loading: false })
    }, 350);

    routeToItem = (item) => {
        Router.push({
            pathname: '/item',
            query: {
                id: item.id
            }
        })
    }
    
    render() {
        return (
            <SearchStyles>
                <Downshift itemToString={(item) => !item ? '' : item.title} onChange={this.routeToItem}>
                    {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => {
                        return (
                            <div>
                                <ApolloConsumer>
                                    {(client) => {
                                        return (
                                            <input 
                                                {...getInputProps({
                                                    type: "search",
                                                    placeholder: "Search For An Item",
                                                    id: 'search',
                                                    className: this.state.loading ? 'loading' : '',
                                                    onChange: (event) => {
                                                        event.persist();
                                                        this.update({ event, client })
                                                    }
                                                })}
                                            />
                                        );
                                    }}
                                </ApolloConsumer>
                                {isOpen && inputValue && (
                                    <DropDown>
                                        {this.state.items.map((item, index) => (
                                            <DropDownItem 
                                                key={item.id}
                                                {...getItemProps({ item })}
                                                highlighted={index === highlightedIndex}                                  
                                            >
                                                <img width="50" src={item.image} alt={item.title}/>
                                                {item.title}                                
                                            </DropDownItem>
                                        ))}
                                        {!this.props.loading && this.state.items.length === 0 && (
                                            <DropDownItem>
                                                <p>No Item Found with: {inputValue}</p>
                                            </DropDownItem>
                                        )}
                                    </DropDown>
                                )}
                                {undefined}
                            </div>
                        )
                    }}
                </Downshift>
            </SearchStyles>
        );
    }
}

export default AutoComplete;