function MakeHtmlMetrics(metrics) {
    let result = '';

    const MakeHtmlField = (key, value) => {
        let result = '';
        result += '<span>';
        result +=     `<span>${key}: </span>`;
        result +=     `<span>${value}</span>`;
        result += '</span>&nbsp;';

        return result;
    };
    
    result += '<div>';
    result +=     MakeHtmlField('Likes', metrics.like_count);
    result +=     MakeHtmlField('Replies', metrics.reply_count);
    result +=     MakeHtmlField('Retweets', metrics.retweet_count);
    result +=     MakeHtmlField('Quotes', metrics.quote_count);
    result += '</div>';

    return result;
}

module.exports = {
    MakeHtmlDescription: tweet => {
        let description = '';
    
        description += '<div>';
    
        if (tweet.text) {
            description += `<p>${tweet.text}</p>`;
        }
    
        if (tweet.public_metrics) {
            description += MakeHtmlMetrics(tweet.public_metrics);
        }
        
        description += '</div>';
    
        return description;
    }
}
