const get = require('lodash/get')

const extractHostNames = (data) => {

    const reservations = get(data, 'Reservations', [])

    return reservations.reduce((hostnames, reservation) => {
        const instances = get(reservation, 'Instances', [])
        instances.map((instance) => {
            if (get(instance, 'State.Name') !== "running") {
                return
            }

            hostnames.push(get(instance, 'PrivateDnsName'))
        })

        return hostnames
    }, [])
}

module.exports = extractHostNames