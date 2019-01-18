import React from 'react';

const Header = (props) => 
{
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a href="https://github.com/manishsaraan/looking-for-maintainers" rel="noopener noreferrer" target="_blank" class="navbar-brand">
            <div class="logo-text">
                <h4>LFM</h4>
            </div>
        </a>
        
                <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">							
                    </ul>				
                    <% if (user) { %>
                    <ul class="navbar-nav ">
                        <li class="nav-item dropdown">
                            <a href="#" class="nav-link dropdown-toggle" id="navDropDownLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <%= user.username %>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navDropDownLink">
                                <a class="dropdown-item" href="/profile">Profile</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/logout">Logout</a>
                            </div>
                        </li>
                    </ul>
                    <% } else { %>
                        <a href="/login/github" rel="noopener noreferrer" class="btn btn-light language-filter shadowed">
                            <i class="fa fa-github mr-1"></i> Login
                        </a>
                    <% } %>
                </div>
            </div>
        
        </nav>)
}